import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, document }) {
    const { data, setData, put, processing, errors } = useForm({
        title: document.title,
        content: document.content,
        type: document.type,
        is_active: Boolean(document.is_active),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.documents.update', document.id));
    };

    return (
        <StaffLayout
            user={auth.user}
            header="テンプレート編集"
        >
            <Head title="テンプレート編集" />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            テンプレート情報の編集
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            書類テンプレートの内容を更新します。
                        </p>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* タイトル */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    タイトル <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    required
                                />
                                {errors.title && <div className="mt-1 text-sm text-red-600">{errors.title}</div>}
                            </div>

                            {/* 種類 */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                    種類 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    required
                                >
                                    <option value="general">一般</option>
                                    <option value="consent">同意書</option>
                                    <option value="contract">契約書</option>
                                    <option value="explanation">説明書</option>
                                </select>
                                {errors.type && <div className="mt-1 text-sm text-red-600">{errors.type}</div>}
                            </div>

                            {/* 内容 */}
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                    内容 (HTML/Text) <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors font-mono text-sm"
                                    rows="15"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    HTMLタグを使用できます。署名欄などは自動的に追加されません。
                                </p>
                                {errors.content && <div className="mt-1 text-sm text-red-600">{errors.content}</div>}
                            </div>

                            {/* ステータス */}
                            <div className="flex items-center">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                    有効（使用可能）
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                            <Link
                                href={route('staff.documents.index')}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                キャンセル
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:border-primary-900 focus:ring ring-primary-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm"
                            >
                                {processing ? '更新中...' : '更新する'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}
