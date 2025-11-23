import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create({ clinicRoles, clinics }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        clinic_role_id: '',
        clinic_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.members.store'));
    };

    return (
        <StaffLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">スタッフ登録</h2>}
        >
            <Head title="スタッフ登録" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                        名前
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                        メールアドレス
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        パスワード
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password_confirmation">
                                        パスワード（確認）
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clinic_role_id">
                                        役割
                                    </label>
                                    <select
                                        id="clinic_role_id"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.clinic_role_id}
                                        onChange={(e) => setData('clinic_role_id', e.target.value)}
                                    >
                                        <option value="">選択してください</option>
                                        {clinicRoles.map((cr) => (
                                            <option key={cr.id} value={cr.id}>
                                                {cr.label ? cr.label : cr.role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.clinic_role_id && <div className="text-red-500 text-xs mt-1">{errors.clinic_role_id}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clinic_id">
                                        所属クリニック
                                    </label>
                                    <select
                                        id="clinic_id"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.clinic_id}
                                        onChange={(e) => setData('clinic_id', e.target.value)}
                                    >
                                        <option value="">選択してください</option>
                                        {clinics.map((clinic) => (
                                            <option key={clinic.id} value={clinic.id}>
                                                {clinic.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.clinic_id && <div className="text-red-500 text-xs mt-1">{errors.clinic_id}</div>}
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        登録
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
