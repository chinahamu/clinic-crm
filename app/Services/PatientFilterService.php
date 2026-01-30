<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class PatientFilterService
{
    /**
     * Apply filters to the User query.
     *
     * @param Builder $query
     * @param array $filters
     * @return Builder
     */
    public function apply(Builder $query, array $filters): Builder
    {
        // 1. Last Visit Before (Dormant for X time)
        // User has NOT visited since this date.
        // Or if strictly "Last visit date is before X", meaning they HAVE visited, but long ago.
        if (!empty($filters['last_visit_before'])) {
            $query->where('last_visit_at', '<', $filters['last_visit_before']);
        }

        // 2. Last Visit After (Active recently)
        if (!empty($filters['last_visit_after'])) {
            $query->where('last_visit_at', '>=', $filters['last_visit_after']);
        }

        // 3. Visit Count (Min)
        // Count ONLY 'visited' status reservations
        if (!empty($filters['min_visit_count'])) {
            $query->whereHas('reservations', function ($q) {
                $q->where('status', 'visited');
            }, '>=', $filters['min_visit_count']);
        }

        // 4. Total Sales (Min)
        // Using Contract total_price as main source
        if (!empty($filters['min_total_sales'])) {
            $query->whereRaw('(SELECT COALESCE(SUM(total_price), 0) FROM contracts WHERE contracts.user_id = users.id) >= ?', [$filters['min_total_sales']]);
        }

        // 5. Birth Month
        if (!empty($filters['birth_month'])) {
            $query->whereMonth('birthday', $filters['birth_month']);
        }

        // 6. Registered After
        if (!empty($filters['registered_after'])) {
            $query->where('created_at', '>=', $filters['registered_after']);
        }

        return $query;
    }
}
