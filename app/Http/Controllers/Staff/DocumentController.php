<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use App\Models\SignedDocument;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        $templates = DocumentTemplate::all();
        return Inertia::render('Staff/Documents/Index', [
            'templates' => $templates,
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Documents/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string',
            'is_active' => 'boolean',
        ]);

        DocumentTemplate::create($validated);

        return redirect()->route('staff.documents.index')->with('success', 'テンプレートを作成しました。');
    }

    public function edit(DocumentTemplate $document)
    {
        return Inertia::render('Staff/Documents/Edit', [
            'document' => $document,
        ]);
    }

    public function update(Request $request, DocumentTemplate $document)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $document->update($validated);

        return redirect()->route('staff.documents.index')->with('success', 'テンプレートを更新しました。');
    }

    public function sign(User $user)
    {
        $templates = DocumentTemplate::where('is_active', true)->get();
        return Inertia::render('Staff/Documents/Sign', [
            'patient' => $user,
            'templates' => $templates,
        ]);
    }

    public function storeSignature(Request $request, User $user)
    {
        $validated = $request->validate([
            'document_template_id' => 'required|exists:document_templates,id',
            'signature_image' => 'required|string', // Base64 string
            'signed_content' => 'required|string',
        ]);

        // Base64画像を保存
        $image = $validated['signature_image'];
        // データURIスキームのプレフィックスを削除
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            $image = substr($image, strpos($image, ',') + 1);
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

        $imageName = 'signatures/' . uniqid() . '.png';
        Storage::disk('public')->put($imageName, $image);

        SignedDocument::create([
            'user_id' => $user->id,
            'document_template_id' => $validated['document_template_id'],
            'staff_id' => Auth::guard('staff')->id(),
            'signed_content' => $validated['signed_content'],
            'signature_image_path' => $imageName,
            'signed_at' => now(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('staff.patients.show', $user->id)->with('success', '署名を保存しました。');
    }
}
