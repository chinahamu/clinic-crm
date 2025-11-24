import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Edit({ auth, clinicRole, clinics, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        clinic_id: clinicRole.clinic_id || '',
        role_id: clinicRole.role_id || '',
        label: clinicRole.label || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.clinic-roles.update', clinicRole.id));
    };

    return (
        <StaffLayout
            user={auth.user}
            header="クリニック別ロール編集"
        >
            <Head title="クリニック別ロール編集" />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            ロール情報の編集
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            登録済みのクリニック別ロール情報を更新します。
                        </p>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* クリニック選択 */}
                            <div>
                                <label htmlFor="clinic_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    クリニック <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="clinic_id"
                                    value={data.clinic_id}
                                    onChange={(e) => setData('clinic_id', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                >
                                    <option value="">選択してください</option>
                                    {clinics.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.clinic_id && <div className="mt-1 text-sm text-red-600">{errors.clinic_id}</div>}
                            </div>

                            {/* ロール選択 */}
                            <div>
                                <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    ロール <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role_id"
                                    value={data.role_id}
                                    onChange={(e) => setData('role_id', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                >
                                    <option value="">選択してください</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                                {errors.role_id && <div className="mt-1 text-sm text-red-600">{errors.role_id}</div>}
                            </div>

                            {/* ラベル */}
                            <div className="sm:col-span-2">
                                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                                    ラベル（表示名） <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="label"
                                    type="text"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                />
                                {errors.label && <div className="mt-1 text-sm text-red-600">{errors.label}</div>}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                            <Link
                                href={route('staff.clinic-roles.index')}
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
