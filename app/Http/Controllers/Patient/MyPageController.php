<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Reservation;
use App\Models\SignedDocument;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MyPageController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Reservations
        $reservations = Reservation::with(['menu', 'clinic'])
            ->where('user_id', $user->id)
            ->get();

        $futureReservations = $reservations->where('start_time', '>=', now())
            ->sortBy('start_time')
            ->values();

        $pastReservations = $reservations->where('start_time', '<', now())
            ->where('status', '!=', 'cancelled')
            ->sortByDesc('start_time')
            ->values();

        // Contracts
        $contracts = Contract::with(['menu', 'usages'])
            ->where('user_id', $user->id)
            ->where(function ($query) {
                // Active or recently completed/expired (optional: adjust logic as needed)
                $query->where('status', 'active')
                      ->orWhere('updated_at', '>=', now()->subMonths(6)); 
            })
            ->orderByDesc('contract_date')
            ->get()
            ->map(function ($contract) {
                // Calculate usage if not directly available (though Contract model has remaining_count)
                // If ContractUsage is the source of truth for history, we can send it.
                // Here we trust the Contract model's remaining_count and total_count.
                return $contract;
            });

        // Documents
        $documents = SignedDocument::with('documentTemplate')
            ->where('user_id', $user->id)
            ->orderByDesc('signed_at')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'title' => $doc->documentTemplate->title ?? '無題のドキュメント',
                    'signed_at' => $doc->signed_at,
                ];
            });

        return Inertia::render('Dashboard', [
            'reservations' => [
                'future' => $futureReservations,
                'past' => $pastReservations,
            ],
            'contracts' => $contracts,
            'documents' => $documents,
        ]);
    }

    public function downloadDocument(SignedDocument $document)
    {
        if ($document->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // Generate PDF
        $html = '<head><style>body { font-family: ipag, serif; }</style></head><body>';
        $html .= $document->signed_content;
        
        // Append signature if exists
        if ($document->signature_image_path) {
            $path = storage_path('app/public/' . $document->signature_image_path);
            if (file_exists($path)) {
                $type = pathinfo($path, PATHINFO_EXTENSION);
                $data = file_get_contents($path);
                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                $html .= '<br><br><div style="text-align:right;">署名:<br><img src="' . $base64 . '" width="150"></div>';
            }
        }
        
        $html .= '</body>';

        $pdf = Pdf::loadHTML($html);
        
        // Set paper size if needed, e.g., A4
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download(($document->documentTemplate->title ?? 'document') . '.pdf');
    }
}
