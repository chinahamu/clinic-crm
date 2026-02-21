<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class PatientFilterService
{
    /**
     * フィルター条件を適用した User クエリビルダーを返す。
     *
     * 利用可能な $filters キー:
     *   clinic_id         int     クリニック絞り込み
     *   min_total_sales   int     最小LTV（円）— patient_values.ltv を参照（Phase1改善）
     *   max_total_sales   int     最大LTV（円）
     *   status_label      string  new / active / dormant （Phase1新規）
     *   visit_count_min   int     来院回数下限（Phase1新規）
     *   visit_count_max   int     来院回数上限（Phase1新規）
     *   dormant_since     string  Y-m-d: この日以降未来院の患者（Phase1新規）
     *   gender            string  性別絞り込み
     *   min_age / max_age int     年齢絞り込み
     *
     * @param array<string, mixed> $filters
     */
    public function apply(array $filters = []): Builder
    {
        $query = User::query();

        // --- クリニック ---
        if (!empty($filters['clinic_id'])) {
            $query->where('clinic_id', $filters['clinic_id']);
        }

        // --- Phase 1: patient_values JOIN に切り替え（サブクエリ排除） ---

        // LTV 最小値
        if (isset($filters['min_total_sales'])) {
            $query->whereHas('patientValue', function (Builder $q) use ($filters) {
                $q->where('ltv', '>=', (int) $filters['min_total_sales']);
            });
        }

        // LTV 最大値
        if (isset($filters['max_total_sales'])) {
            $query->whereHas('patientValue', function (Builder $q) use ($filters) {
                $q->where('ltv', '<=', (int) $filters['max_total_sales']);
            });
        }

        // ステータスラベル（new / active / dormant）
        if (!empty($filters['status_label'])) {
            $query->whereHas('patientValue', function (Builder $q) use ($filters) {
                $q->where('status_label', $filters['status_label']);
            });
        }

        // 来院回数 下限
        if (isset($filters['visit_count_min'])) {
            $query->whereHas('patientValue', function (Builder $q) use ($filters) {
                $q->where('visit_count', '>=', (int) $filters['visit_count_min']);
            });
        }

        // 来院回数 上限
        if (isset($filters['visit_count_max'])) {
            $query->whereHas('patientValue', function (Builder $q) use ($filters) {
                $q->where('visit_count', '<=', (int) $filters['visit_count_max']);
            });
        }

        // 休眠開始日以降未来院
        if (!empty($filters['dormant_since'])) {
            $query->whereHas('patientValue', function (Builder $q) use ($filters) {
                $q->where('last_visit_at', '<=', $filters['dormant_since']);
            });
        }

        // --- デモグラフィックフィルター ---
        if (!empty($filters['gender'])) {
            $query->where('gender', $filters['gender']);
        }

        if (isset($filters['min_age'])) {
            $query->whereDate(
                'birthday', '<=',
                now()->subYears((int) $filters['min_age'])->toDateString()
            );
        }

        if (isset($filters['max_age'])) {
            $query->whereDate(
                'birthday', '>=',
                now()->subYears((int) $filters['max_age'] + 1)->addDay()->toDateString()
            );
        }

        return $query;
    }
}
