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
    private function getAvailableVariables()
    {
        return [
            ['key' => 'patient_name', 'label' => '患者名', 'description' => '患者の氏名'],
            ['key' => 'patient_id', 'label' => '診察券番号', 'description' => '患者の診察券番号'],
            ['key' => 'current_date', 'label' => '作成日', 'description' => '書類作成日（今日の日付）'],
            ['key' => 'clinic_name', 'label' => 'クリニック名', 'description' => 'クリニックの名称'],
            ['key' => 'staff_name', 'label' => '担当スタッフ', 'description' => '担当スタッフの氏名'],
        ];
    }

    public function index()
    {
        $templates = DocumentTemplate::all();
        return Inertia::render('Staff/Documents/Index', [
            'templates' => $templates,
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Documents/Create', [
            'variables' => $this->getAvailableVariables(),
        ]);
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
            'variables' => $this->getAvailableVariables(),
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
        
        // テンプレートの内容を変数置換して渡す（またはフロントエンドで選択時に置換するが、
        // ここではテンプレートリストを渡しているので、選択時に動的に置換するのが良い。
        // しかし、Inertiaで渡すデータはJSONなので、テンプレート選択時にAJAXで取得するか、
        // あるいは全テンプレートのコンテンツを事前に置換しておくか。
        // テンプレート数が多いと重くなるが、現状は全件取得している。
        // 簡易的に、フロントエンドで置換ロジックを持つか、APIを叩くか。
        // 今回はシンプルに、テンプレートデータはそのまま渡し、署名画面で選択されたときに
        // サーバーサイドで置換したコンテンツを取得するAPIを作るのがベストだが、
        // 既存のSign.jsxは `templates` propから選んでいる。
        // なので、Sign.jsxに渡すtemplatesの中身を、このユーザー向けに置換済みのものにしてしまうのが一番手っ取り早い。
        
        $replacedTemplates = $templates->map(function ($template) use ($user) {
            $content = $template->content;
            $content = str_replace('{{ patient_name }}', $user->name, $content);
            $content = str_replace('{{ patient_id }}', $user->id, $content); // 診察券番号があればそれを使う
            $content = str_replace('{{ current_date }}', now()->format('Y年m月d日'), $content);
            $content = str_replace('{{ clinic_name }}', config('app.name', 'Clinic CRM'), $content);
            $content = str_replace('{{ staff_name }}', Auth::guard('staff')->user()->name ?? '担当者', $content);
            
            $template->content = $content;
            return $template;
        });

        return Inertia::render('Staff/Documents/Sign', [
            'patient' => $user,
            'templates' => $replacedTemplates,
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
