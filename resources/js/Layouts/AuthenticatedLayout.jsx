import React from 'react';
import { Link } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, header, children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route('home')}>
                                    <span className="font-bold text-xl text-blue-600">Clinic CRM</span>
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href={route('home')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        route().current('home')
                                            ? 'border-indigo-400 text-gray-900 focus:outline-none focus:border-indigo-700'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300'
                                    }`}
                                >
                                    ダッシュボード
                                </Link>
                                <Link
                                    href={route('reservations.create')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
                                        route().current('reservations.create')
                                            ? 'border-indigo-400 text-gray-900 focus:outline-none focus:border-indigo-700'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300'
                                    }`}
                                >
                                    新規予約
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-3 relative">
                                <div className="text-sm text-gray-500">{user.name}</div>
                            </div>
                             <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="ml-4 text-sm text-red-600 hover:text-red-900"
                            >
                                ログアウト
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}