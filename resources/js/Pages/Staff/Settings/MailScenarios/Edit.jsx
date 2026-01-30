import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ scenario }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: scenario.name,
        is_active: Boolean(scenario.is_active),
        trigger_type: scenario.trigger_type,
        days_offset: scenario.days_offset,
        subject: scenario.subject,
        body: scenario.body,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('staff.mail-scenarios.update', scenario.id));
    };

    return (
        <StaffLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">シナリオ編集</h2>}
        >
            <Head title="シナリオ編集" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        シナリオ名 (管理用)
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    {errors.name && <div className="mt-2 text-sm text-red-600">{errors.name}</div>}
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                        有効にする
                                    </label>
                                    {errors.is_active && <div className="mt-2 text-sm text-red-600">{errors.is_active}</div>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Trigger */}
                                    <div>
                                        <label htmlFor="trigger_type" className="block text-sm font-medium text-gray-700">
                                            配信トリガー
                                        </label>
                                        <select
                                            id="trigger_type"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.trigger_type}
                                            onChange={(e) => setData('trigger_type', e.target.value)}
                                        >
                                            <option value="after_visit">来院後</option>
                                        </select>
                                        {errors.trigger_type && <div className="mt-2 text-sm text-red-600">{errors.trigger_type}</div>}
                                    </div>

                                    {/* Days Offset */}
                                    <div>
                                        <label htmlFor="days_offset" className="block text-sm font-medium text-gray-700">
                                            経過日数 (0=当日, 1=翌日)
                                        </label>
                                        <input
                                            id="days_offset"
                                            type="number"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.days_offset}
                                            onChange={(e) => setData('days_offset', e.target.value)}
                                            required
                                            min="0"
                                        />
                                        {errors.days_offset && <div className="mt-2 text-sm text-red-600">{errors.days_offset}</div>}
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                        メール件名
                                    </label>
                                    <input
                                        id="subject"
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        required
                                    />
                                    {errors.subject && <div className="mt-2 text-sm text-red-600">{errors.subject}</div>}
                                </div>

                                {/* Body */}
                                <div>
                                    <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                                        メール本文
                                    </label>
                                    <textarea
                                        id="body"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows="10"
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        required
                                    ></textarea>
                                    <p className="mt-1 text-sm text-gray-500">
                                        使用可能な変数: {'{name}'} (患者名), {'{clinic_name}'} (クリニック名), {'{visit_date}'} (来院日)
                                    </p>
                                    {errors.body && <div className="mt-2 text-sm text-red-600">{errors.body}</div>}
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Link
                                        href={route('staff.mail-scenarios.index')}
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
                                    >
                                        キャンセル
                                    </Link>
                                    <button
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        disabled={processing}
                                    >
                                        更新する
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
