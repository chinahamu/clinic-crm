<?php

namespace App\Traits;

use App\Models\SignedDocument;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

trait GeneratesDocumentPdf
{
    /**
     * Generate a PDF for a signed document.
     *
     * @param string $content HTML content
     * @param string $signatureBase64 Base64 signature image
     * @param string $documentId UUID or unique ID
     * @param \DateTimeInterface $signedAt
     * @return array [file_path, file_hash]
     */
    protected function generateAndSavePdf($content, $signatureBase64, $documentId, $signedAt, $variables = [])
    {
        $content = $this->replaceVariables($content, $variables);

        $pdfContent = Pdf::loadHTML($this->generatePdfHtml(
            $content,
            $signatureBase64,
            $documentId,
            $signedAt
        ))->setPaper('a4')->output();

        $pdfFilename = 'contracts/' . $documentId . '.pdf';
        Storage::put($pdfFilename, $pdfContent);

        $fileHash = hash('sha256', $pdfContent);

        return [
            'file_path' => $pdfFilename,
            'file_hash' => $fileHash,
        ];
    }

    /**
     * Generate HTML for the PDF.
     */
    protected function generatePdfHtml($content, $signatureBase64, $documentId, $signedAt)
    {
        if ($signedAt instanceof \DateTimeInterface) {
            $formattedDate = $signedAt->format('Y-m-d H:i:s');
            $yearDate = $signedAt->format('Y年m月d日');
        } else {
            $formattedDate = now()->format('Y-m-d H:i:s');
            $yearDate = now()->format('Y年m月d日');
        }

        $signatureImgTag = '<img src="data:image/png;base64,' . $signatureBase64 . '" style="max-width: 300px; display: block; margin-top: 20px;" />';
        
        return <<<HTML
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'ipag', 'ipaexg', sans-serif;
                    font-size: 11pt;
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
                Document ID: {$documentId} / Signed at: {$formattedDate}
            </div>
            
            <div class="container">
                {$content}
                
                <div class="signature-section">
                    <p>署名:</p>
                    {$signatureImgTag}
                    <p>署名日: {$yearDate}</p>
                </div>
            </div>
        </body>
        </html>
HTML;
    }

    /**
     * Replace variables in content.
     */
    protected function replaceVariables($content, $variables)
    {
        foreach ($variables as $key => $value) {
            $content = str_replace('{{ ' . $key . ' }}', $value, $content);
        }
        return $content;
    }
}
