import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ clinicRoles }) {
    return (
        <StaffLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">クリニック別ロール</h2>}>
            <Head title="クリニック別ロール" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between mb-6">
                                <h3 className="text-lg font-medium">クリニック別ロール一覧</h3>
                                <Link
                                    href={route('staff.clinic-roles.create')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    新規作成
                                </Link>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">クリニック</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ロール</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ラベル</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {clinicRoles.map((cr) => (
                                        <tr key={cr.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{cr.clinic ? cr.clinic.name : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{cr.role ? cr.role.name : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{cr.label}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={route('staff.clinic-roles.edit', cr.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">編集</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
