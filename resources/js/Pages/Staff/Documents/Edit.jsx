import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, document }) {
    const { data, setData, put, processing, errors } = useForm({
        title: document.title,
        content: document.content,
        type: document.type,
        is_active: document.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.documents.update', document.id));
    };

    return (
        <StaffLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">テンプレート編集</h2>}
        >
            <Head title="テンプレート編集" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                        タイトル
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    {errors.title && <div className="text-red-500 text-xs italic">{errors.title}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                                        種類
                                    </label>
                                    <select
                                        id="type"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        <option value="general">一般</option>
                                        <option value="consent">同意書</option>
                                        <option value="contract">契約書</option>
                                        <option value="explanation">説明書</option>
                                    </select>
                                    {errors.type && <div className="text-red-500 text-xs italic">{errors.type}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                        内容 (HTML/Text)
                                    </label>
                                    <textarea
                                        id="content"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-64"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                    />
                                    {errors.content && <div className="text-red-500 text-xs italic">{errors.content}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                        />
                                        <span className="ml-2">有効にする</span>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        更新
                                    </button>
                                    <Link
                                        href={route('staff.documents.index')}
                                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                    >
                                        キャンセル
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
