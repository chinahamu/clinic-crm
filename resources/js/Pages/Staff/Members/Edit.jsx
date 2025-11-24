import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Edit({ auth, member, clinicRoles, clinics }) {
    const { data, setData, put, processing, errors } = useForm({
        name: member.name,
        email: member.email,
        password: '',
        password_confirmation: '',
        clinic_role_id: member.clinic_role_id || '',
        clinic_id: member.clinic_id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.members.update', member.id));
    };

    return (
        <StaffLayout
            user={auth.user}
            header="スタッフ編集"
        >
            <Head title="スタッフ編集" />

            <div className="max-w-3xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            スタッフ情報の編集
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            スタッフ情報を更新します。
                        </p>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* 名前 */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    名前 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    required
                                />
                                {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                            </div>

                            {/* メールアドレス */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    メールアドレス <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    required
                                />
                                {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* パスワード */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        パスワード <span className="text-xs text-gray-500 font-normal">（変更する場合のみ）</span>
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        autoComplete="new-password"
                                    />
                                    {errors.password && <div className="mt-1 text-sm text-red-600">{errors.password}</div>}
                                </div>

                                {/* パスワード（確認） */}
                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                        パスワード（確認）
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 役割 */}
                                <div>
                                    <label htmlFor="clinic_role_id" className="block text-sm font-medium text-gray-700 mb-1">
                                        役割 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="clinic_role_id"
                                        value={data.clinic_role_id}
                                        onChange={(e) => setData('clinic_role_id', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        required
                                    >
                                        <option value="">選択してください</option>
                                        {clinicRoles.map((cr) => (
                                            <option key={cr.id} value={cr.id}>
                                                {cr.label ? cr.label : cr.role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.clinic_role_id && <div className="mt-1 text-sm text-red-600">{errors.clinic_role_id}</div>}
                                </div>

                                {/* 所属クリニック */}
                                <div>
                                    <label htmlFor="clinic_id" className="block text-sm font-medium text-gray-700 mb-1">
                                        所属クリニック <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="clinic_id"
                                        value={data.clinic_id}
                                        onChange={(e) => setData('clinic_id', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        required
                                    >
                                        <option value="">選択してください</option>
                                        {clinics.map((clinic) => (
                                            <option key={clinic.id} value={clinic.id}>
                                                {clinic.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.clinic_id && <div className="mt-1 text-sm text-red-600">{errors.clinic_id}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                            <Link
                                href={route('staff.members.index')}
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
