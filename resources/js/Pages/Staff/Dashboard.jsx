import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <div className="bg-gray-100 min-h-screen">
            <Head title="スタッフダッシュボード" />
            <nav className="bg-white shadow mb-8 border-b-4 border-green-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="font-bold text-xl text-green-600">Clinic CRM Staff</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">{auth.user.name} (スタッフ)</span>
                            <Link
                                href={route('staff.logout')}
                                method="post"
                                as="button"
                                className="text-red-600 hover:text-red-800"
                            >
                                ログアウト
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        スタッフ専用管理画面へようこそ。
                    </div>
                </div>
            </div>
        </div>
    );
}
