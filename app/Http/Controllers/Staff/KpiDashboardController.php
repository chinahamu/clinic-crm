<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\PatientValue;
use App\Models\Reservation;
use App\Models\StepMailLog;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class KpiDashboardController extends Controller
{
    public function index()
    {
        $now          = Carbon::now();
        $thisMonth    = $now->copy()->startOfMonth();
        $lastMonth    = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        // ----------------------------------------------------------
        // KPI カード集計
        // ----------------------------------------------------------
        $visitCount     = Reservation::where('status', 'visited')
            ->where('start_time', '>=', $thisMonth)->count();
        $lastVisitCount = Reservation::where('status', 'visited')
            ->whereBetween('start_time', [$lastMonth, $lastMonthEnd])->count();

        $newPatients     = User::where('created_at', '>=', $thisMonth)->count();
        $lastNewPatients = User::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();

        $monthlySales     = (int) Contract::where('created_at', '>=', $thisMonth)->sum('total_price');
        $lastMonthlySales = (int) Contract::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->sum('total_price');

        $avgLtv = (int) (PatientValue::avg('ltv') ?? 0);

        // ----------------------------------------------------------
        // 来院トレンド（過去12ヶ月）
        // ----------------------------------------------------------
        $visitTrend = collect(range(11, 0))->map(function (int $i) use ($now) {
            $month = $now->copy()->subMonths($i);
            $start = $month->copy()->startOfMonth();
            $end   = $month->copy()->endOfMonth();

            $newCount = User::whereBetween('created_at', [$start, $end])->count();

            // 2回目以降の来院
            $repeatCount = Reservation::where('status', 'visited')
                ->whereBetween('start_time', [$start, $end])
                ->whereIn('user_id', function ($q) use ($start) {
                    $q->select('user_id')
                      ->from('reservations')
                      ->where('status', 'visited')
                      ->where('start_time', '<', $start)
                      ->distinct();
                })
                ->count();

            return [
                'label'  => $month->format('n月'),
                'new'    => $newCount,
                'repeat' => $repeatCount,
            ];
        })->values();

        // ----------------------------------------------------------
        // シナリオ配信効果（今月）
        // ----------------------------------------------------------
        $scenarioSent    = StepMailLog::where('status', 'sent')
            ->whereMonth('sent_at', $now->month)->count();
        $scenarioSkipped = StepMailLog::where('status', 'skipped')
            ->whereMonth('created_at', $now->month)->count();
        $scenarioFailed  = StepMailLog::where('status', 'failed')
            ->whereMonth('created_at', $now->month)->count();

        // ----------------------------------------------------------
        // 休眠患者リスト（最大20件）
        // ----------------------------------------------------------
        $dormantPatients = User::whereHas('patientValue', fn ($q) =>
                $q->where('status_label', 'dormant')
            )
            ->with('patientValue')
            ->orderByDesc(
                PatientValue::select('last_visit_at')
                    ->whereColumn('user_id', 'users.id')
                    ->limit(1)
            )
            ->limit(20)
            ->get()
            ->map(fn ($u) => [
                'id'            => $u->id,
                'name'          => $u->name,
                'last_visit_at' => $u->patientValue?->last_visit_at?->format('Y/m/d'),
                'ltv'           => $u->patientValue?->ltv ?? 0,
                'visit_count'   => $u->patientValue?->visit_count ?? 0,
                'has_line'      => !empty($u->line_id),
            ]);

        return Inertia::render('Staff/KpiDashboard', [
            'kpi' => [
                'visit_count'        => $visitCount,
                'last_visit_count'   => $lastVisitCount,
                'new_patients'       => $newPatients,
                'last_new_patients'  => $lastNewPatients,
                'monthly_sales'      => $monthlySales,
                'last_monthly_sales' => $lastMonthlySales,
                'avg_ltv'            => $avgLtv,
            ],
            'visit_trend'      => $visitTrend,
            'scenario_effect'  => [
                'sent'    => $scenarioSent,
                'skipped' => $scenarioSkipped,
                'failed'  => $scenarioFailed,
            ],
            'dormant_patients' => $dormantPatients,
        ]);
    }
}
