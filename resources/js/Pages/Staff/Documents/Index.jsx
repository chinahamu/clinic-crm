import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ auth, templates }) {
    const { flash = {} } = usePage().props;

    const getTypeLabel = (type) => {
        const types = {
            general: '一般',
            consent: '同意書',
            contract: '契約書',
            explanation: '説明書'
        };
        return types[type] || type;
    };

    const getTypeColor = (type) => {
        const colors = {
            general: 'bg-gray-100 text-gray-800',
            consent: 'bg-blue-100 text-blue-800',
            contract: 'bg-purple-100 text-purple-800',
            explanation: 'bg-yellow-100 text-yellow-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <StaffLayout
            user={auth.user}
            header="書類テンプレート管理"
        >
            <Head title="書類テンプレート管理" />

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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            テンプレート一覧
                        </h3>
                        <Link
                            href={route('staff.documents.create')}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:border-primary-900 focus:ring ring-primary-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm w-full sm:w-auto justify-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            新規作成
                        </Link>
                    </div>

                    {/* モバイル向けカードビュー */}
                    <div className="block lg:hidden divide-y divide-gray-100">
                        {templates.map((template) => (
                            <div key={template.id} className="p-4 hover:bg-gray-50/50 transition-colors duration-150">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-gray-900">{template.title}</div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${getTypeColor(template.type)}`}>
                                                {getTypeLabel(template.type)}
                                            </span>
                                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                                template.is_active 
                                                    ? 'bg-green-50 text-green-700 border-green-100' 
                                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                            }`}>
                                                {template.is_active ? '有効' : '無効'}
                                            </span>
                                        </div>
                                    </div>
                                    <Link 
                                        href={route('staff.documents.edit', template.id)} 
                                        className="text-primary-600 hover:text-primary-900 transition-colors inline-flex items-center text-xs"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        編集
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {templates.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p>登録されているテンプレートはありません</p>
                            </div>
                        )}
                    </div>

                    {/* デスクトップ向けテーブルビュー */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        タイトル
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        種類
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        ステータス
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {templates.map((template) => (
                                    <tr key={template.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{template.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${getTypeColor(template.type)}`}>
                                                {getTypeLabel(template.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                                template.is_active 
                                                    ? 'bg-green-50 text-green-700 border-green-100' 
                                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                            }`}>
                                                {template.is_active ? '有効' : '無効'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link 
                                                href={route('staff.documents.edit', template.id)} 
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
                                {templates.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p>登録されているテンプレートはありません</p>
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
