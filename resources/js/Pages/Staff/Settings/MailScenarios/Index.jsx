import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Index({ scenarios }) {
    const { flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('本当に削除しますか？')) {
            router.delete(route('staff.mail-scenarios.destroy', id));
        }
    };

    return (
        <StaffLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">ステップ配信設定</h2>}
        >
            <Head title="ステップ配信設定" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">シナリオ一覧</h3>
                                <Link
                                    href={route('staff.mail-scenarios.create')}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    新規作成
                                </Link>
                            </div>

                            <div className="overflow-x-auto relative">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3 px-6">シナリオ名</th>
                                            <th scope="col" className="py-3 px-6">タイミング</th>
                                            <th scope="col" className="py-3 px-6">ステータス</th>
                                            <th scope="col" className="py-3 px-6 text-right">アクション</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scenarios.length > 0 ? (
                                            scenarios.map((scenario) => (
                                                <tr key={scenario.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                                        {scenario.name}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {scenario.trigger_type === 'after_visit' ? '来院' : scenario.trigger_type}から
                                                        {scenario.days_offset}日後
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {scenario.is_active ? (
                                                            <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">有効</span>
                                                        ) : (
                                                            <span className="bg-gray-100 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">無効</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <Link
                                                            href={route('staff.mail-scenarios.edit', scenario.id)}
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                                                        >
                                                            編集
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(scenario.id)}
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                                        >
                                                            削除
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-4 px-6 text-center text-gray-400">
                                                    登録されたシナリオはありません
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
