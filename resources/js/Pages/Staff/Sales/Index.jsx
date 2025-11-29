import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ salesData, totalSales, totalCount, filters }) {
    const { auth } = usePage().props;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
    };

    const handleFilterChange = (key, value) => {
        router.get(route('staff.sales.index'), {
            ...filters,
            [key]: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <StaffLayout user={auth.user} header="売上管理">
            <Head title="売上管理" />

            <div className="space-y-6">
                {/* Date Filter */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4">
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">開始日</label>
                            <input
                                type="date"
                                id="start_date"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                value={filters.start_date}
                                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                            />
                        </div>
                        <span className="text-gray-400 hidden sm:block">～</span>
                        <div>
                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
                            <input
                                type="date"
                                id="end_date"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                value={filters.end_date}
                                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-50 text-green-600">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">総売上</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">完了予約数</p>
                                <p className="text-2xl font-bold text-gray-900">{totalCount} <span className="text-sm font-normal text-gray-500">件</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">メニュー別売上</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メニュー名</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">件数</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">売上金額</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">構成比</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {salesData.map((item) => {
                                    const percentage = totalSales > 0 ? (item.total_sales / totalSales) * 100 : 0;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}件</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatCurrency(item.total_sales)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap align-middle">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1 inline-block">{percentage.toFixed(1)}%</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {salesData.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">データがありません</td>
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
