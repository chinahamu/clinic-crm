import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ menus }) {
    const { flash = {}, auth } = usePage().props;

    return (
        <StaffLayout
            user={auth.user}
            header="メニュー管理"
        >
            <Head title="メニュー管理" />

            <div className="space-y-4 lg:space-y-6">
                {flash.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center shadow-sm" role="alert">
                        <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="block sm:inline font-medium text-sm">{flash.success}</span>
                    </div>
                )}

                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            メニュー一覧
                        </h3>
                        <Link
                            href={route('staff.menus.create')}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:border-primary-900 focus:ring ring-primary-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm w-full sm:w-auto justify-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            新規作成
                        </Link>
                    </div>

                    {/* モバイル向けカードビュー */}
                    <div className="block lg:hidden divide-y divide-gray-100">
                        {menus.map((menu) => (
                            <div key={menu.id} className="p-4 hover:bg-gray-50/50 transition-colors duration-150">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-gray-900">{menu.name}</div>
                                        <div className="text-lg font-bold text-primary-600 mt-1">¥{menu.price.toLocaleString()}</div>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded">{menu.duration_minutes}分</span>
                                            {menu.required_room_type && (
                                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                                    部屋: {menu.required_room_type}
                                                </span>
                                            )}
                                            {menu.required_machine_type && (
                                                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                                                    機械: {menu.required_machine_type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Link 
                                        href={route('staff.menus.edit', menu.id)} 
                                        className="text-primary-600 hover:text-primary-900 transition-colors inline-flex items-center text-xs"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        編集
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {menus.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                <p>登録されているメニューはありません</p>
                            </div>
                        )}
                    </div>

                    {/* デスクトップ向けテーブルビュー */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        メニュー名
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        料金
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        所要時間
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        必須条件
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {menus.map((menu) => (
                                    <tr key={menu.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{menu.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">¥{menu.price.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{menu.duration_minutes}分</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                {menu.required_room_type && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                        部屋: {menu.required_room_type}
                                                    </span>
                                                )}
                                                {menu.required_machine_type && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                                                        機械: {menu.required_machine_type}
                                                    </span>
                                                )}
                                                {!menu.required_room_type && !menu.required_machine_type && (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link 
                                                href={route('staff.menus.edit', menu.id)} 
                                                className="text-primary-600 hover:text-primary-900 transition-colors inline-flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                編集
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {menus.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                                <p>登録されているメニューはありません</p>
                                            </div>
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