import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: '',
        quantity: 1,
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.machines.store'));
    };

    return (
        <StaffLayout
            user={auth.user}
            header="機器登録"
        >
            <Head title="機器登録" />

            <div className="max-w-3xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            新規機器登録
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            新しい機器の情報を入力してください。
                        </p>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* 機器名 */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    機器名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    placeholder="例: レーザー脱毛機 A"
                                    required
                                />
                                {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                            </div>

                            {/* タイプ */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                    タイプ
                                </label>
                                <input
                                    id="type"
                                    type="text"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    placeholder="例: 脱毛機"
                                />
                                {errors.type && <div className="mt-1 text-sm text-red-600">{errors.type}</div>}
                            </div>

                            {/* 台数 */}
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                    台数 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="quantity"
                                    type="number"
                                    min="0"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    required
                                />
                                {errors.quantity && <div className="mt-1 text-sm text-red-600">{errors.quantity}</div>}
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
                                href={route('staff.machines.index')}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                キャンセル
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:border-primary-900 focus:ring ring-primary-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm"
                            >
                                {processing ? '登録中...' : '登録する'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}
