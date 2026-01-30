import React from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Form({ segment }) {
    const { auth } = usePage().props;
    const isEdit = !!segment;

    const { data, setData, post, put, processing, errors } = useForm({
        name: segment?.name || '',
        filters: {
            last_visit_before: segment?.filters?.last_visit_before || '',
            last_visit_after: segment?.filters?.last_visit_after || '',
            min_visit_count: segment?.filters?.min_visit_count || '',
            min_total_sales: segment?.filters?.min_total_sales || '',
            birth_month: segment?.filters?.birth_month || '',
            registered_after: segment?.filters?.registered_after || '',
        },
    });

    const setFilter = (key, value) => {
        setData('filters', { ...data.filters, [key]: value });
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('staff.marketing.segments.update', segment.id));
        } else {
            post(route('staff.marketing.segments.store'));
        }
    };

    return (
        <StaffLayout
            user={auth.user}
            header={isEdit ? 'セグメント編集' : '新規セグメント作成'}
        >
            <Head title={isEdit ? 'セグメント編集' : '新規セグメント作成'} />

            <div className="space-y-6">
                {/* Demo Hints Alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm">デモ用データのご案内</h4>
                        <p className="text-sm text-blue-800 mt-1">以下の条件でテストデータが作成されています。組み合わせの参考にしてください。</p>
                        <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li><b>休眠顧客</b>: 最終来院日が6ヶ月以上前（約15名）</li>
                            <li><b>VIP顧客</b>: 売上30万円以上 かつ 来院回数10回以上（約10名）</li>
                            <li><b>新規登録</b>: 今月登録されたユーザー（約20名）</li>
                            <li><b>翌月誕生日</b>: 来月が誕生日のユーザー（約8名）</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">セグメント名</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="例: 半年以上来院なし、VIP会員など"
                                required
                            />
                            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                絞り込み条件
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                {/* Last Visit Before */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">最終来院日 (これより前 / 休眠)</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.filters.last_visit_before}
                                        onChange={(e) => setFilter('last_visit_before', e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">※ 指定した日付より前に来院したきりの患者</p>
                                </div>

                                {/* Last Visit After */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">最終来院日 (これ以降 / アクティブ)</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.filters.last_visit_after}
                                        onChange={(e) => setFilter('last_visit_after', e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">※ 指定した日付以降に来院がある患者</p>
                                </div>

                                {/* Min Visit Count */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">最低来院回数</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.filters.min_visit_count}
                                        onChange={(e) => setFilter('min_visit_count', e.target.value)}
                                        min="0"
                                    />
                                </div>

                                {/* Min Total Sales */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">最低累計売上 (円)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.filters.min_total_sales}
                                        onChange={(e) => setFilter('min_total_sales', e.target.value)}
                                        min="0"
                                    />
                                </div>

                                {/* Birth Month */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">誕生月</label>
                                    <select
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.filters.birth_month}
                                        onChange={(e) => setFilter('birth_month', e.target.value)}
                                    >
                                        <option value="">指定なし</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}月</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Registered After */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">登録日 (これ以降 / 新規)</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        value={data.filters.registered_after}
                                        onChange={(e) => setFilter('registered_after', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Link
                                href={route('staff.marketing.segments.index')}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none transition ease-in-out duration-150"
                            >
                                キャンセル
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 focus:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-sm"
                            >
                                {isEdit ? '更新する' : '保存する'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}
