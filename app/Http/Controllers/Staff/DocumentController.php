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

    public function sign(User $user, Request $request)
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

        $contractId = $request->query('contract_id');
        $contract = $contractId ? \App\Models\Contract::find($contractId) : null;

        return Inertia::render('Staff/Documents/Sign', [
            'patient' => $user,
            'templates' => $replacedTemplates,
            'contract' => $contract,
        ]);
    }

    public function storeSignature(Request $request, User $user)
    {
        $validated = $request->validate([
            'document_template_id' => 'required|exists:document_templates,id',
            'signature_image' => 'required|string', // Base64 string
            'signed_content' => 'required|string',
            'contract_id' => 'nullable|exists:contracts,id',
        ]);

        // Base64画像を保存 (画像ファイルも念のため残すが、PDFが原本となる)
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

        $signatureFilename = 'signatures/' . uniqid() . '.png';
        Storage::disk('public')->put($signatureFilename, $image);
        $signatureFullPath = Storage::disk('public')->path($signatureFilename);
        $signatureBase64 = base64_encode(file_get_contents($signatureFullPath));


        // PDF生成
        $documentId = (string) \Illuminate\Support\Str::uuid();
        $signedAt = now();
        $pdfContent = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($this->generatePdfHtml(
            $validated['signed_content'],
            $signatureBase64,
            $documentId,
            $signedAt
        ))->setPaper('a4')->output();

        // PDF保存 (private disk)
        // disk('local') is usually storage/app. We'll store in private/contracts.
        $pdfFilename = 'private/contracts/' . $documentId . '.pdf';
        Storage::put($pdfFilename, $pdfContent);

        // ハッシュ計算
        $fileHash = hash('sha256', $pdfContent);

        SignedDocument::create([
            'user_id' => $user->id,
            'document_template_id' => $validated['document_template_id'],
            'staff_id' => Auth::guard('staff')->id(),
            'contract_id' => $validated['contract_id'] ?? null,
            'signed_content' => $validated['signed_content'],
            'signature_image_path' => $signatureFilename, // Keep the original image path logic for now
            'file_path' => $pdfFilename,
            'file_hash' => $fileHash,
            'signed_at' => $signedAt,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'signed_data' => json_encode(['document_uuid' => $documentId]),
        ]);

        activity()
            ->performedOn($user)
            ->withProperties([
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'document_id' => $documentId,
            ])
            ->log('契約書署名完了');

        // If specific contract, update status or redirect specifically? 
        // For now standard redirect.
        return redirect()->route('staff.patients.show', $user->id)->with('success', '署名を保存し、原本PDFを作成しました。');
    }

    public function downloadPdf(SignedDocument $signedDocument)
    {
        // Check authorization if needed (e.g., only staff or the patient)
        
        if (!Storage::exists($signedDocument->file_path)) {
            abort(404, 'PDF file not found.');
        }

        return Storage::download($signedDocument->file_path, 'signed_document_' . $signedDocument->id . '.pdf');
    }

    private function generatePdfHtml($content, $signatureBase64, $documentId, $signedAt)
    {
        // 日本語フォント対応のためのCSSなどはここで定義
        // NOTE: 実際の環境に合わせてフォントパスなどを調整する必要がありますが、
        // ここでは標準的な日本語対応CSSをインラインで埋め込みます。
        // ipaexg.ttfなどがstorage/fontsにある前提、あるいはCDN/Google FontsはDomPDFでは難しいので
        // 標準の firefly, ume, ipa などがサーバーにあればそれを使う。
        // ここでは汎用的な sans-serif を指定しつつ、必要なら @font-face を追加。
        
        $signatureImgTag = '<img src="data:image/png;base64,' . $signatureBase64 . '" style="max-width: 300px; display: block; margin-top: 20px;" />';
        
        return <<<HTML
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'ipesxg', sans-serif; /* Setup correct font family for Japanese */
                    font-size: 12pt;
                    line-height: 1.6;
                    color: #333;
                }
                @page {
                    margin: 0cm 0cm;
                }
                .container {
                    padding: 2cm;
                }
                .footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1.5cm;
                    background-color: #f3f4f6;
                    color: #6b7280;
                    text-align: center;
                    line-height: 1.5cm;
                    font-size: 9pt;
                    border-top: 1px solid #e5e7eb;
                }
                .signature-section {
                    margin-top: 50px;
                    border-top: 1px solid #ccc;
                    padding-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="footer">
                Document ID: {$documentId} / Signed at: {$signedAt->format('Y-m-d H:i:s')}
            </div>
            
            <div class="container">
                {$content}
                
                <div class="signature-section">
                    <p>署名:</p>
                    {$signatureImgTag}
                    <p>署名日: {$signedAt->format('Y年m月d日')}</p>
                </div>
            </div>
        </body>
        </html>
HTML;
    }
}
