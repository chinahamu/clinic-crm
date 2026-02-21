import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

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

const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MenuListIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const UserGroupIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ClipboardListIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const ShoppingBagIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const KeyIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);

const DocumentTextIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const OfficeBuildingIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const ChipIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
);

const LogoutIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

// ハンバーガーメニューアイコン
const HamburgerIcon = ({ className }) => (
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

const ChartBarIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const MailIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const QrcodeIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 6h6v6H6V6zm12 0h6v6h-6V6zm-6 12h6v6h-6v-6zm-6 0h6v6H6v-6z" />
    </svg>
);

export default function StaffLayout({ user, header, children }) {
    const { auth } = usePage().props;
    const currentUser = user ?? (auth ? auth.user : null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navLinkClass = (active) => `group flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
        ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
        }`;

    const iconClass = (active) => `mr-3 h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`;

    // ナビゲーション項目を共通化
    const navItems = (
        <>
            <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                メイン
            </div>
            <Link
                href={route('staff.dashboard')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.dashboard'))}
            >
                <DashboardIcon className={iconClass(route().current('staff.dashboard'))} />
                ダッシュボード
            </Link>
            <Link
                href={route('staff.kpi-dashboard')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.kpi-dashboard'))}
            >
                <ChartBarIcon className={iconClass(route().current('staff.kpi-dashboard'))} />
                KPIダッシュボード
            </Link>
            <Link
                href={route('staff.reservations.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.reservations.*'))}
            >
                <CalendarIcon className={iconClass(route().current('staff.reservations.*'))} />
                予約管理
            </Link>
            <Link
                href={route('staff.shifts.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.shifts.*'))}
            >
                <ClockIcon className={iconClass(route().current('staff.shifts.*'))} />
                シフト管理
            </Link>
            <Link
                href={route('staff.sales.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.sales.*'))}
            >
                <ChartBarIcon className={iconClass(route().current('staff.sales.*'))} />
                売上管理
            </Link>
            <Link
                href={route('staff.kiosk.check-in')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.kiosk.*'))}
            >
                <QrcodeIcon className={iconClass(route().current('staff.kiosk.*'))} />
                QR受付 (Kiosk)
            </Link>

            <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                マーケティング
            </div>
            <Link
                href={route('staff.marketing.segments.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.marketing.segments.*'))}
            >
                <UsersIcon className={iconClass(route().current('staff.marketing.segments.*'))} />
                顧客セグメント
            </Link>

            <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                管理
            </div>
            <Link
                href={route('staff.patients.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.patients.*'))}
            >
                <UsersIcon className={iconClass(route().current('staff.patients.*'))} />
                患者管理
            </Link>
            <Link
                href={route('staff.members.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.members.*'))}
            >
                <UserGroupIcon className={iconClass(route().current('staff.members.*'))} />
                スタッフ管理
            </Link>
            <Link
                href={route('staff.menus.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.menus.*'))}
            >
                <MenuListIcon className={iconClass(route().current('staff.menus.*'))} />
                メニュー管理
            </Link>
            <Link
                href={route('staff.products.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.products.*'))}
            >
                <ShoppingBagIcon className={iconClass(route().current('staff.products.*'))} />
                商品管理
            </Link>

            <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                在庫・物品
            </div>
            <Link
                href={route('staff.medicines.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.medicines.*'))}
            >
                <svg className={iconClass(route().current('staff.medicines.*'))} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                薬剤管理
            </Link>
            <Link
                href={route('staff.consumables.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.consumables.*'))}
            >
                <svg className={iconClass(route().current('staff.consumables.*'))} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                消耗品管理
            </Link>
            <Link
                href={route('staff.inventories.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.inventories.*'))}
            >
                <svg className={iconClass(route().current('staff.inventories.*'))} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                在庫管理
            </Link>

            <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                システム
            </div>
            {/* クリニック別ロール管理（HQ またはクリニック所属スタッフに表示） */}
            {user && ((user.roles && user.roles.some(r => r.name === 'hq')) || user.clinic_id) && (
                <Link
                    href={route('staff.clinic-roles.index')}
                    onClick={() => setSidebarOpen(false)}
                    className={navLinkClass(route().current('staff.clinic-roles.*'))}
                >
                    <KeyIcon className={iconClass(route().current('staff.clinic-roles.*'))} />
                    クリニック別ロール
                </Link>
            )}
            <Link
                href={route('staff.documents.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.documents.*'))}
            >
                <DocumentTextIcon className={iconClass(route().current('staff.documents.*'))} />
                書類管理
            </Link>
            <Link
                href={route('staff.rooms.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.rooms.*'))}
            >
                <OfficeBuildingIcon className={iconClass(route().current('staff.rooms.*'))} />
                部屋管理
            </Link>
            <Link
                href={route('staff.machines.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.machines.*'))}
            >
                <ChipIcon className={iconClass(route().current('staff.machines.*'))} />
                機器管理
            </Link>
            <Link
                href={route('staff.audit-logs.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.audit-logs.*'))}
            >
                <ClipboardListIcon className={iconClass(route().current('staff.audit-logs.*'))} />
                操作ログ
            </Link>
            <Link
                href={route('staff.settings.clinic.edit')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.settings.clinic.*'))}
            >
                <OfficeBuildingIcon className={iconClass(route().current('staff.settings.clinic.*'))} />
                クリニック設定
            </Link>
            <Link
                href={route('staff.mail-scenarios.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.mail-scenarios.*'))}
            >
                <MailIcon className={iconClass(route().current('staff.mail-scenarios.*'))} />
                ステップ配信設定
            </Link>
            <Link
                href={route('staff.settings.interviews.index')}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(route().current('staff.settings.interviews.*'))}
            >
                <DocumentTextIcon className={iconClass(route().current('staff.settings.interviews.*'))} />
                問診票テンプレート
            </Link>
        </>
    );

    // ユーザー情報とログアウトボタン
    const userSection = (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm border-2 border-white shadow-sm">
                    {currentUser ? currentUser.name.charAt(0) : 'S'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{currentUser ? currentUser.name : ''}</p>
                    <p className="text-xs text-gray-500 truncate">Staff Account</p>
                </div>
            </div>
            <Link
                href={route('staff.logout')}
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
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                        <Link href={route('staff.dashboard')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                                S
                            </div>
                            <span className="font-bold text-lg text-gray-800 tracking-tight">Clinic CRM</span>
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
                        <Link href={route('staff.dashboard')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                                S
                            </div>
                            <span className="font-bold text-xl text-gray-800 tracking-tight">Clinic CRM <span className="text-xs font-normal text-gray-500 ml-1">Staff</span></span>
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
                            <HamburgerIcon className="h-6 w-6" />
                        </button>
                        <Link href={route('staff.dashboard')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                                S
                            </div>
                            <span className="font-bold text-lg text-gray-800 tracking-tight">Staff</span>
                        </Link>
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                            {currentUser ? currentUser.name.charAt(0) : 'S'}
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