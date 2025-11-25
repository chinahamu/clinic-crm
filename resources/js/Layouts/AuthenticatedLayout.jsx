import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

// Icons
const DashboardIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const CalendarIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const LogoutIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

// ハンバーガーメニューアイコン
const MenuIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

// 閉じるアイコン
const CloseIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function AuthenticatedLayout({ user, header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ナビゲーション項目を共通化
    const navItems = (
        <>
            <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                メニュー
            </div>
            <Link
                href={route('home')}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    route().current('home')
                        ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                }`}
            >
                <DashboardIcon className={`mr-3 h-5 w-5 ${route().current('home') ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                ダッシュボード
            </Link>
            <Link
                href={route('reservations.create')}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    route().current('reservations.create')
                        ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                }`}
            >
                <CalendarIcon className={`mr-3 h-5 w-5 ${route().current('reservations.create') ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                新規予約
            </Link>
        </>
    );

    // ユーザー情報とログアウトボタン
    const userSection = (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm border-2 border-white shadow-sm">
                    {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
            </div>
            <Link
                href={route('logout')}
                method="post"
                as="button"
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors duration-200 shadow-sm"
            >
                <LogoutIcon className="mr-2 h-4 w-4" />
                ログアウト
            </Link>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* モバイルオーバーレイ */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* モバイルサイドバー */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                        <Link href={route('home')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                                C
                            </div>
                            <span className="font-bold text-xl text-gray-800 tracking-tight">Clinic CRM</span>
                        </Link>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                        {navItems}
                    </div>
                    {userSection}
                </div>
            </div>

            {/* デスクトップサイドバー */}
            <nav className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-shrink-0 shadow-sm z-10">
                <div className="h-full flex flex-col w-full">
                    <div className="h-20 flex items-center px-8 border-b border-gray-100">
                        <Link href={route('home')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                                C
                            </div>
                            <span className="font-bold text-xl text-gray-800 tracking-tight">Clinic CRM</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        {navItems}
                    </div>
                    {userSection}
                </div>
            </nav>

            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                {/* モバイルヘッダー */}
                <header className="bg-white shadow-sm border-b border-gray-100 lg:hidden">
                    <div className="flex items-center justify-between h-16 px-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <Link href={route('home')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                                C
                            </div>
                            <span className="font-bold text-lg text-gray-800 tracking-tight">Clinic CRM</span>
                        </Link>
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* ページヘッダー（タイトル） */}
                {header && (
                    <header className="bg-white shadow-sm border-b border-gray-100 z-0">
                        <div className="max-w-7xl mx-auto py-4 lg:py-6 px-4 lg:px-8">
                            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">{header}</h1>
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}