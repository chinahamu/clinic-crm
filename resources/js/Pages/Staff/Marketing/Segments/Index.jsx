import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ segments }) {
    const { flash = {}, auth } = usePage().props;

    const renderFiltersSummary = (filters) => {
        const parts = [];
        if (filters.last_visit_before) parts.push(`最終来院 < ${filters.last_visit_before}`);
        if (filters.last_visit_after) parts.push(`最終来院 >= ${filters.last_visit_after}`);
        if (filters.min_visit_count) parts.push(`来院回数 >= ${filters.min_visit_count}回`);
        if (filters.min_total_sales) parts.push(`売上 >= ¥${Number(filters.min_total_sales).toLocaleString()}`);
        if (filters.birth_month) parts.push(`誕生月: ${filters.birth_month}月`);
        if (filters.registered_after) parts.push(`登録日 >= ${filters.registered_after}`);

        if (parts.length === 0) return <span className="text-gray-400">条件なし</span>;

        return (
            <div className="flex flex-wrap gap-1">
                {parts.map((p, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {p}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <StaffLayout
            user={auth.user}
            header="顧客セグメント管理"
        >
            <Head title="顧客セグメント管理" />

            <div className="space-y-4 lg:space-y-6">
                {flash.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center shadow-sm" role="alert">
                        <span className="block sm:inline font-medium text-sm">{flash.success}</span>
                    </div>
                )}

                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            顧客セグメント一覧
                        </h3>
                        <Link
                            href={route('staff.marketing.segments.create')}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 transition ease-in-out duration-150 shadow-sm"
                        >
                            新規作成
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">セグメント名</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">条件</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">作成日</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {segments.map((segment) => (
                                    <tr key={segment.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                            <Link href={route('staff.marketing.segments.show', segment.id)} className="hover:text-primary-600 hover:underline">
                                                {segment.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderFiltersSummary(segment.filters)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(segment.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={route('staff.marketing.segments.edit', segment.id)}
                                                className="text-primary-600 hover:text-primary-900 mr-4"
                                            >
                                                編集
                                            </Link>
                                            <Link
                                                href={route('staff.marketing.segments.show', segment.id)}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                詳細
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {segments.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            データがありません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
