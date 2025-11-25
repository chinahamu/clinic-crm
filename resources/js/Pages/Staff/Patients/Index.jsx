import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ patients }) {
    const { auth } = usePage().props;

    return (
        <StaffLayout
            user={auth.user}
            header="患者管理"
        >
            <Head title="患者管理" />

            <div className="space-y-4 lg:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">患者一覧</h2>
                    {/* 必要であれば新規登録ボタンなどをここに配置 */}
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    {/* モバイル向けカードビュー */}
                    <div className="block lg:hidden divide-y divide-gray-100">
                        {patients.data.map((patient) => (
                            <div key={patient.id} className="p-4 hover:bg-gray-50/50 transition-colors duration-150">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{patient.name}</div>
                                            <div className="text-xs text-gray-500">{patient.email}</div>
                                            {patient.phone && (
                                                <div className="text-xs text-gray-400 mt-0.5">{patient.phone}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {patient.caution_flag ? (
                                            <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-50 text-red-700 border border-red-100">
                                                注意
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-700 border border-green-100">
                                                正常
                                            </span>
                                        )}
                                        <Link 
                                            href={route('staff.patients.show', patient.id)} 
                                            className="text-primary-600 hover:text-primary-900 font-bold text-xs"
                                        >
                                            詳細 →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {patients.data.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                <p>登録されている患者はいません</p>
                            </div>
                        )}
                    </div>

                    {/* デスクトップ向けテーブルビュー */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        氏名
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        連絡先
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        ステータス
                                    </th>
                                    <th scope="col" className="relative px-6 py-4">
                                        <span className="sr-only">操作</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {patients.data.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            #{patient.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs mr-3">
                                                    {patient.name.charAt(0)}
                                                </div>
                                                <div className="text-sm font-bold text-gray-900">{patient.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{patient.email}</div>
                                            <div className="text-xs text-gray-500">{patient.phone || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {patient.caution_flag ? (
                                                <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-50 text-red-700 border border-red-100">
                                                    注意
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-700 border border-green-100">
                                                    正常
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link 
                                                href={route('staff.patients.show', patient.id)} 
                                                className="text-primary-600 hover:text-primary-900 font-bold hover:underline"
                                            >
                                                詳細
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {patients.links && (
                        <div className="px-4 lg:px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            {/* Pagination implementation would go here */}
                        </div>
                    )}
                </div>
            </div>
        </StaffLayout>
    );
}
