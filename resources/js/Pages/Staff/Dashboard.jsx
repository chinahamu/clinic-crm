import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Dashboard({ today_reservations_count, today_schedule }) {
    const { auth } = usePage().props;

    return (
        <StaffLayout
            user={auth.user}
            header="スタッフダッシュボード"
        >
            <Head title="スタッフダッシュボード" />

            <div className="space-y-6">
                {/* 統計カード */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-primary-50 text-primary-600">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">本日の来院予定</p>
                                <p className="text-2xl font-bold text-gray-900">{today_reservations_count} <span className="text-sm font-normal text-gray-500">名</span></p>
                            </div>
                        </div>
                    </div>
                    {/* 他の統計情報があればここに追加 */}
                </div>

                {/* 本日のスケジュール */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">本日の施術スケジュール</h3>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
                        </span>
                    </div>
                    
                    <div className="p-0">
                        {today_schedule.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">時間</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">患者名</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">メニュー</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ステータス</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {today_schedule.map((reservation) => (
                                            <tr key={reservation.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs mr-3">
                                                            {reservation.user ? reservation.user.name.charAt(0) : 'G'}
                                                        </div>
                                                        {reservation.user ? reservation.user.name : 'ゲスト'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800">
                                                        {reservation.menu ? reservation.menu.name : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${reservation.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                            reservation.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                                'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}>
                                                        {reservation.status === 'confirmed' ? '確定' :
                                                            reservation.status === 'cancelled' ? 'キャンセル' : '確認中'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">本日の予定はありません</h3>
                                <p className="mt-1 text-gray-500">ゆっくり準備を整えましょう。</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
