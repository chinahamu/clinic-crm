import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StaffLayout from '@/Layouts/StaffLayout';
import { format } from 'date-fns';

export default function Index({ auth, templates }) {
    const handleDelete = (id) => {
        if (confirm('本当に削除しますか？')) {
            router.delete(route('staff.settings.interviews.destroy', id));
        }
    };

    return (
        <StaffLayout user={auth.user} header="問診票テンプレート管理">
            <Head title="問診票テンプレート" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Actions */}
                    <div className="mb-6 flex justify-end">
                        <Link
                            href={route('staff.settings.interviews.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            新規作成
                        </Link>
                    </div>

                    {/* List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {templates.map((template) => (
                                <li key={template.id} className="p-6 hover:bg-gray-50 flex items-center justify-between transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center">
                                            <p className="text-lg font-bold text-blue-600 truncate mr-4">
                                                {template.name}
                                            </p>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                全 {template.questions?.length || 0} 問
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            最終更新: {format(new Date(template.updated_at), 'yyyy/MM/dd HH:mm')}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('staff.settings.interviews.edit', template.id)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(template.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </li>
                            ))}

                            {templates.length === 0 && (
                                <li className="p-12 text-center text-gray-500">
                                    テンプレートがまだ作成されていません。
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
