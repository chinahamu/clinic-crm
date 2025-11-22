import React from 'react';
import { Link } from '@inertiajs/react';

export default function StaffLayout({ user, header, children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <nav className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-gray-200">
                        <Link href={route('staff.dashboard')}>
                            <span className="font-bold text-xl text-green-600">Clinic CRM (Staff)</span>
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
                        <Link
                            href={route('staff.dashboard')}
                            className={`block px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                                route().current('staff.dashboard')
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            ダッシュボード
                        </Link>
                        <Link
                            href={route('staff.reservations.index')}
                            className={`block px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                                route().current('staff.reservations.*')
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            予約管理
                        </Link>
                        <Link
                            href={route('staff.shifts.index')}
                            className={`block px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                                route().current('staff.shifts.*')
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            シフト管理
                        </Link>
                        <Link
                            href={route('staff.menus.index')}
                            className={`block px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                                route().current('staff.menus.*')
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            メニュー管理
                        </Link>
                        <Link
                            href={route('staff.documents.index')}
                            className={`block px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                                route().current('staff.documents.*')
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            書類管理
                        </Link>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="text-sm font-medium text-gray-700">{user.name}</div>
                        </div>
                        <Link
                            href={route('staff.logout')}
                            method="post"
                            as="button"
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition duration-150 ease-in-out"
                        >
                            ログアウト
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex-1 flex flex-col overflow-hidden">
                {header && (
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}