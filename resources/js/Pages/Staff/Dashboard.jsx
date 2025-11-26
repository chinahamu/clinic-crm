import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Dashboard({ today_reservations_count, today_schedule, low_stock_products }) {
    const { auth } = usePage().props;

    return (
        <StaffLayout
            user={auth.user}
            header="スタッフダッシュボード"
        >
            <Head title="スタッフダッシュボード" />

            <div className="space-y-4 lg:space-y-6">
                {/* 統計カード */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-4 lg:p-6">
                        <div className="flex items-center">
                            <div className="p-2 lg:p-3 rounded-full bg-primary-50 text-primary-600">
                                <svg className="h-6 w-6 lg:h-8 lg:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-3 lg:ml-4">
                                <p className="text-xs lg:text-sm font-medium text-gray-500">本日の来院予定</p>
                                <p className="text-xl lg:text-2xl font-bold text-gray-900">{today_reservations_count} <span className="text-xs lg:text-sm font-normal text-gray-500">名</span></p>
                            </div>
                        </div>
                    </div>
                    {/* 他の統計情報があればここに追加 */}
                </div>

                {/* 在庫警告 */}
                {low_stock_products && low_stock_products.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 lg:p-6">
                        <h3 className="text-lg font-bold text-red-800 flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            在庫警告
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {low_stock_products.map((product) => (
                                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-red-100 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-gray-900">{product.name}</div>
                                        <div className="text-sm text-red-600 font-bold">
                                            残り: {product.stock}個 <span className="text-xs text-gray-500 font-normal">(閾値: {product.threshold})</span>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('staff.products.edit', product.id)}
                                        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                                    >
                                        補充
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 本日のスケジュール */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">本日の施術スケジュール</h3>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
                        </span>
                    </div>

                    <div className="p-0">
                        {today_schedule.length > 0 ? (
                            <>
                                {/* モバイル向けカードビュー */}
                                <div className="block lg:hidden divide-y divide-gray-100">
                                    {today_schedule.map((reservation) => (
                                        <div key={reservation.id} className="p-4 hover:bg-gray-50/50 transition-colors duration-150">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                        {reservation.user ? reservation.user.name.charAt(0) : 'G'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">
                                                            {reservation.user ? reservation.user.name : 'ゲスト'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${reservation.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                        reservation.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                            'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}>
                                                    {reservation.status === 'confirmed' ? '確定' :
                                                        reservation.status === 'cancelled' ? 'キャンセル' : '確認中'}
                                                </span>
                                            </div>
                                            <div className="ml-10">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-xs">
                                                    {reservation.menu ? reservation.menu.name : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* デスクトップ向けテーブルビュー */}
                                <div className="hidden lg:block overflow-x-auto">
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
                            </>
                        ) : (
                            <div className="p-8 lg:p-12 text-center">
                                <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">本日の予定はありません</h3>
                                <p className="mt-1 text-sm text-gray-500">ゆっくり準備を整えましょう。</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
