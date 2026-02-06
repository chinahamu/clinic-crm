<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\Contract;
use App\Models\Menu;
use App\Models\Product;
use App\Models\DocumentTemplate;
use App\Models\SignedDocument;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ContractDocumentController extends Controller
{
    public function create(User $patient)
    {
        return Inertia::render('Staff/Contracts/Create', [
            'patient' => $patient,
            'menus' => Menu::where('is_active', true)->get(),
            'products' => Product::all(),
            'staff' => Auth::guard('staff')->user(),
            'clinic' => Clinic::first(), // Assuming single clinic for now or logic to get current clinic
        ]);
    }

    public function store(Request $request, User $patient)
    {
        $validated = $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'contract_date' => 'required|date',
            'total_count' => 'required|integer|min:1',
            'total_price' => 'required|integer|min:0',
            'discount_amount' => 'required|integer|min:0',
            'campaign_name' => 'nullable|string',
            'expiration_date' => 'nullable|date',
            'notes' => 'nullable|string',
            
            'products' => 'nullable|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.amount' => 'required|integer|min:0',
            
            'payments' => 'required|array|min:1',
            'payments.*.payment_method' => 'required|string',
            'payments.*.amount' => 'required|integer|min:1',
            
            'outline_signature' => 'required|string', // Base64
            'contract_signature' => 'required|string', // Base64
        ]);

        try {
            DB::beginTransaction();

            // 1. Create Contract
            $contract = Contract::create([
                'user_id' => $patient->id,
                'menu_id' => $validated['menu_id'],
                'clinic_id' => Auth::guard('staff')->user()->clinic_id, // Assuming staff belongs to a clinic
                'contract_date' => $validated['contract_date'],
                'total_count' => $validated['total_count'],
                'remaining_count' => $validated['total_count'],
                'total_price' => $validated['total_price'],
                'discount_amount' => $validated['discount_amount'],
                'campaign_name' => $validated['campaign_name'],
                'expiration_date' => $validated['expiration_date'],
                'notes' => $validated['notes'],
                'status' => 'active',
            ]);

            // 2. Create Contract Products
            if (!empty($validated['products'])) {
                foreach ($validated['products'] as $product) {
                    $contract->products()->create($product);
                }
            }

            // 3. Create Contract Payments
            foreach ($validated['payments'] as $payment) {
                $contract->payments()->create($payment);
            }

            // 4. Save Signatures (Outline & Contract)
            $this->saveSignature($patient, $contract, $validated['outline_signature'], '概要書面');
            $this->saveSignature($patient, $contract, $validated['contract_signature'], '契約書');

            DB::commit();

            return redirect()->route('staff.patients.show', $patient->id)
                ->with('success', '契約を作成しました。');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => '契約の作成に失敗しました: ' . $e->getMessage()]);
        }
    }

    public function createConsentDocument(User $patient)
    {
        return Inertia::render('Staff/Documents/SignConsent', [
            'patient' => $patient,
            'templates' => DocumentTemplate::where('is_active', true)->get(),
        ]);
    }

    public function storeConsentDocument(Request $request, User $patient)
    {
        $validated = $request->validate([
            'document_template_id' => 'required|exists:document_templates,id',
            'signature_data' => 'required|string', // Base64
        ]);

        // 1. Save Signature Image
        $signature = $validated['signature_data'];
        $imageName = 'sig_' . time() . '_' . uniqid() . '.png';
        
        // Remove prefix
        $imageData = preg_replace('#^data:image/\w+;base64,#i', '', $signature);
        Storage::disk('public')->put('signatures/' . $imageName, base64_decode($imageData));

        // 2. Create SignedDocument
        SignedDocument::create([
            'user_id' => $patient->id,
            'document_template_id' => $validated['document_template_id'],
            'signature_image_path' => 'signatures/' . $imageName,
            'signed_at' => now(),
            'staff_id' => Auth::guard('staff')->id(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'signed_content' => DocumentTemplate::find($validated['document_template_id'])->content,
        ]);

        return redirect()->route('staff.patients.show', $patient->id)
                         ->with('success', '同意書を保存しました');
    }

    private function saveSignature($user, $contract, $base64Image, $title)
    {
        // Base64 decoding
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            $image = substr($base64Image, strpos($base64Image, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif
            
            if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
                throw new \Exception('invalid image type');
            }
            $image = base64_decode($image);
            
            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $imageName = 'signatures/' . uniqid() . '_' . $contract->id . '.png';
        Storage::disk('public')->put($imageName, $image);

        // Ideally we should link this to a document_templates record, but for now we might
        // create a dummy one or update SignedDocument to allow null template_id if appropriate,
        // OR we just create a generic "Contract" template if not exists.
        // For this specific requirement, let's assume we can store it.
        // HOWEVER, signed_documents table requires document_template_id.
        // I will dynamically create a dummy template or use a fixed ID. 
        // For SAFETY, let's assume specific template IDs exist or create them on the fly?
        // Let's create a generic record or make the column nullable in migration? 
        // No, migration is already done.
        // Let's CREATE a dummy template if not exists for "System Generated".
        
        $template = \App\Models\DocumentTemplate::firstOrCreate(
            ['title' => $title],
            ['content' => 'System Generated', 'type' => 'contract']
        );

        SignedDocument::create([
            'user_id' => $user->id,
            'document_template_id' => $template->id,
            'staff_id' => Auth::guard('staff')->id(),
            'contract_id' => $contract->id,
            'signed_content' => 'System Generated Contract', // This would ideally be the HTML content
            'signature_image_path' => $imageName,
            'signed_at' => now(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
