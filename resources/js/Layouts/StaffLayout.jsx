import React from 'react';
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

const MenuIcon = ({ className }) => (
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

export default function StaffLayout({ user, header, children }) {
    const { auth } = usePage().props;
    const currentUser = user ?? (auth ? auth.user : null);
    
    const navLinkClass = (active) => `group flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
            ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
    }`;

    const iconClass = (active) => `mr-3 h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`;

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            <nav className="w-72 bg-white border-r border-gray-200 flex-shrink-0 shadow-sm z-10">
                <div className="h-full flex flex-col">
                    <div className="h-20 flex items-center px-8 border-b border-gray-100">
                        <Link href={route('staff.dashboard')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                                S
                            </div>
                            <span className="font-bold text-xl text-gray-800 tracking-tight">Clinic CRM <span className="text-xs font-normal text-gray-500 ml-1">Staff</span></span>
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            メイン
                        </div>
                        <Link
                            href={route('staff.dashboard')}
                            className={navLinkClass(route().current('staff.dashboard'))}
                        >
                            <DashboardIcon className={iconClass(route().current('staff.dashboard'))} />
                            ダッシュボード
                        </Link>
                        <Link
                            href={route('staff.reservations.index')}
                            className={navLinkClass(route().current('staff.reservations.*'))}
                        >
                            <CalendarIcon className={iconClass(route().current('staff.reservations.*'))} />
                            予約管理
                        </Link>
                        <Link
                            href={route('staff.shifts.index')}
                            className={navLinkClass(route().current('staff.shifts.*'))}
                        >
                            <ClockIcon className={iconClass(route().current('staff.shifts.*'))} />
                            シフト管理
                        </Link>

                        <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            管理
                        </div>
                        <Link
                            href={route('staff.patients.index')}
                            className={navLinkClass(route().current('staff.patients.*'))}
                        >
                            <UsersIcon className={iconClass(route().current('staff.patients.*'))} />
                            患者管理
                        </Link>
                        <Link
                            href={route('staff.members.index')}
                            className={navLinkClass(route().current('staff.members.*'))}
                        >
                            <UserGroupIcon className={iconClass(route().current('staff.members.*'))} />
                            スタッフ管理
                        </Link>
                        <Link
                            href={route('staff.menus.index')}
                            className={navLinkClass(route().current('staff.menus.*'))}
                        >
                            <MenuIcon className={iconClass(route().current('staff.menus.*'))} />
                            メニュー管理
                        </Link>
                        <Link
                            href={route('staff.products.index')}
                            className={navLinkClass(route().current('staff.products.*'))}
                        >
                            <ShoppingBagIcon className={iconClass(route().current('staff.products.*'))} />
                            商品管理
                        </Link>

                        <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            システム
                        </div>
                        {/* クリニック別ロール管理（HQ またはクリニック所属スタッフに表示） */}
                        {user && ((user.roles && user.roles.some(r => r.name === 'hq')) || user.clinic_id) && (
                            <Link
                                href={route('staff.clinic-roles.index')}
                                className={navLinkClass(route().current('staff.clinic-roles.*'))}
                            >
                                <KeyIcon className={iconClass(route().current('staff.clinic-roles.*'))} />
                                クリニック別ロール
                            </Link>
                        )}
                        <Link
                            href={route('staff.documents.index')}
                            className={navLinkClass(route().current('staff.documents.*'))}
                        >
                            <DocumentTextIcon className={iconClass(route().current('staff.documents.*'))} />
                            書類管理
                        </Link>
                        <Link
                            href={route('staff.rooms.index')}
                            className={navLinkClass(route().current('staff.rooms.*'))}
                        >
                            <OfficeBuildingIcon className={iconClass(route().current('staff.rooms.*'))} />
                            部屋管理
                        </Link>
                        <Link
                            href={route('staff.machines.index')}
                            className={navLinkClass(route().current('staff.machines.*'))}
                        >
                            <ChipIcon className={iconClass(route().current('staff.machines.*'))} />
                            機器管理
                        </Link>
                        <Link
                            href={route('staff.audit-logs.index')}
                            className={navLinkClass(route().current('staff.audit-logs.*'))}
                        >
                            <ClipboardListIcon className={iconClass(route().current('staff.audit-logs.*'))} />
                            操作ログ
                        </Link>
                    </div>

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
                </div>
            </nav>

            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                {header && (
                    <header className="bg-white shadow-sm border-b border-gray-100 z-0">
                        <div className="max-w-7xl mx-auto py-6 px-8">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{header}</h1>
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}