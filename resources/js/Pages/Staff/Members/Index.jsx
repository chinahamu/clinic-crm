import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ staffMembers }) {
    const { flash = {}, auth } = usePage().props;

    return (
        <StaffLayout
            user={auth.user}
            header="スタッフ管理"
        >
            <Head title="スタッフ管理" />

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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            スタッフ一覧
                        </h3>
                        <Link
                            href={route('staff.members.create')}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:border-primary-900 focus:ring ring-primary-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm w-full sm:w-auto justify-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            新規登録
                        </Link>
                    </div>

                    {/* モバイル向けカードビュー */}
                    <div className="block lg:hidden divide-y divide-gray-100">
                        {staffMembers.map((member) => (
                            <div key={member.id} className="p-4 hover:bg-gray-50/50 transition-colors duration-150">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{member.name}</div>
                                            <div className="text-xs text-gray-500">{member.email}</div>
                                        </div>
                                    </div>
                                    <Link 
                                        href={route('staff.members.edit', member.id)} 
                                        className="text-primary-600 hover:text-primary-900 transition-colors inline-flex items-center text-xs"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        編集
                                    </Link>
                                </div>
                                <div className="mt-3 ml-13 space-y-2">
                                    <div className="flex flex-wrap gap-1">
                                        {member.roles.map((role, index) => (
                                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {role.name}
                                            </span>
                                        ))}
                                    </div>
                                    {member.clinic && (
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            {member.clinic.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {staffMembers.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p>登録されているスタッフはいません</p>
                            </div>
                        )}
                    </div>

                    {/* デスクトップ向けテーブルビュー */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        名前
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        メールアドレス
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        役割
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        所属クリニック
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {staffMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs mr-3">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="text-sm font-bold text-gray-900">{member.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{member.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {member.roles.map((role, index) => (
                                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {member.clinic ? (
                                                    <span className="inline-flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        {member.clinic.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link 
                                                href={route('staff.members.edit', member.id)} 
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
                                {staffMembers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <p>登録されているスタッフはいません</p>
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
