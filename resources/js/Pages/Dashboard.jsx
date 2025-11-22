import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">患者様ダッシュボード</h2>}
        >
            <Head title="患者様ダッシュボード" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            患者様用マイページへようこそ。
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
