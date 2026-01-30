<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\CustomerSegment;
use App\Models\User;
use App\Services\PatientFilterService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CustomerSegmentController extends Controller
{
    protected $filterService;

    public function __construct(PatientFilterService $filterService)
    {
        $this->filterService = $filterService;
    }

    public function index(Request $request)
    {
        $segments = CustomerSegment::where('clinic_id', $request->user()->clinic_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Staff/Marketing/Segments/Index', [
            'segments' => $segments,
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Marketing/Segments/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'filters' => 'required|array',
        ]);

        CustomerSegment::create([
            'clinic_id' => $request->user()->clinic_id,
            'name' => $validated['name'],
            'filters' => $validated['filters'],
        ]);

        return redirect()->route('staff.marketing.segments.index')
            ->with('success', 'Segment created successfully.');
    }

    public function edit(CustomerSegment $segment)
    {
        $this->authorizeSegment($segment);

        return Inertia::render('Staff/Marketing/Segments/Form', [
            'segment' => $segment,
        ]);
    }

    public function update(Request $request, CustomerSegment $segment)
    {
        $this->authorizeSegment($segment);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'filters' => 'required|array',
        ]);

        $segment->update($validated);

        return redirect()->route('staff.marketing.segments.index')
            ->with('success', 'Segment updated successfully.');
    }

    public function show(CustomerSegment $segment)
    {
        $this->authorizeSegment($segment);

        $query = $this->getBaseQuery();
        $this->filterService->apply($query, $segment->filters);

        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Staff/Marketing/Segments/Show', [
            'segment' => $segment,
            'users' => $users,
        ]);
    }

    public function export(CustomerSegment $segment)
    {
        $this->authorizeSegment($segment);

        return response()->streamDownload(function () use ($segment) {
            $handle = fopen('php://output', 'w');
            // BOM for Excel
            fputs($handle, "\xEF\xBB\xBF");
            fputcsv($handle, ['ID', 'Name', 'Email', 'Phone', 'Last Visit', 'Registered At']);

            $query = $this->getBaseQuery();
            $this->filterService->apply($query, $segment->filters);

            foreach ($query->cursor() as $user) {
                fputcsv($handle, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->phone,
                    $user->last_visit_at,
                    $user->created_at->format('Y-m-d'),
                ]);
            }
            fclose($handle);
        }, 'segment_' . $segment->id . '_' . now()->format('YmdHis') . '.csv');
    }

    public function destroy(CustomerSegment $segment)
    {
        $this->authorizeSegment($segment);
        $segment->delete();

        return redirect()->route('staff.marketing.segments.index')
            ->with('success', 'Segment deleted.');
    }

    private function authorizeSegment(CustomerSegment $segment)
    {
        if ($segment->clinic_id !== request()->user()->clinic_id) {
            abort(403);
        }
    }

    private function getBaseQuery()
    {
        $clinicId = request()->user()->clinic_id;
        // Filter users associated with this clinic
        return User::query()->where(function($q) use ($clinicId) {
            $q->whereHas('reservations', fn($r) => $r->where('clinic_id', $clinicId))
              ->orWhereHas('contracts', fn($c) => $c->where('clinic_id', $clinicId))
              ->orWhereHas('contracts.payments', fn($p) => $p->where('id', '>', 0)); // payments don't have clinic_id usually but contract does.
        });
    }
}
