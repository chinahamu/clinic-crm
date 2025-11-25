import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth, reservations }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header="患者様ダッシュボード"
        >
            <Head title="患者様ダッシュボード" />

            <div className="space-y-4 lg:space-y-6">
                {/* ウェルカムメッセージ */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-4 lg:p-8">
                        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">ようこそ、{auth.user.name} 様</h3>
                        <p className="text-sm lg:text-base text-gray-500">次回の予約確認や、新しい予約の取得が可能です。</p>
                    </div>
                </div>

                {/* 予約一覧 */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">予約一覧</h3>
                        <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                            全 {reservations.length} 件
                        </span>
                    </div>
                    
                    <div className="p-0">
                        {reservations.length > 0 ? (
                            <>
                                {/* モバイル向けカードビュー */}
                                <div className="block lg:hidden divide-y divide-gray-100">
                                    {reservations.map((reservation) => (
                                        <div key={reservation.id} className="p-4 hover:bg-gray-50/50 transition-colors duration-150">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {new Date(reservation.start_time).toLocaleString('ja-JP', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    reservation.status === 'confirmed' 
                                                        ? 'bg-green-50 text-green-700 border border-green-100' 
                                                        : reservation.status === 'cancelled' 
                                                            ? 'bg-red-50 text-red-700 border border-red-100' 
                                                            : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                                }`}>
                                                    {reservation.status === 'confirmed' ? '確定' :
                                                        reservation.status === 'cancelled' ? 'キャンセル' : '確認中'}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    {reservation.clinic?.name || '-'}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    {reservation.menu?.name || '-'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* デスクトップ向けテーブルビュー */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">日時</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">クリニック</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">メニュー</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ステータス</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {reservations.map((reservation) => (
                                                <tr key={reservation.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {new Date(reservation.start_time).toLocaleString('ja-JP', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {reservation.clinic?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800">
                                                            {reservation.menu?.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            reservation.status === 'confirmed' 
                                                                ? 'bg-green-50 text-green-700 border border-green-100' 
                                                                : reservation.status === 'cancelled' 
                                                                    ? 'bg-red-50 text-red-700 border border-red-100' 
                                                                    : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                                        }`}>
                                                            {reservation.status === 'confirmed' ? '確定' :
                                                                reservation.status === 'cancelled' ? 'キャンセル' : '確認中'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 lg:p-12 text-center">
                                <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">予約はありません</h3>
                                <p className="mt-1 text-sm text-gray-500">新しい予約を入れて、クリニックを利用しましょう。</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
