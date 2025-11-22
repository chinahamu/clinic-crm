import React from 'react';
import { Head, usePage, Link, useForm } from '@inertiajs/react';

export default function Edit({ patient }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        birthday: patient.birthday || '',
        gender: patient.gender || '',
        address: patient.address || '',
        referral_source: patient.referral_source || '',
        consent_status: patient.consent_status || '',
        caution_flag: patient.caution_flag ? true : false,
        caution_details: patient.caution_details || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.patients.update', patient.id));
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Head title={`患者編集: ${patient.name}`} />
            <nav className="bg-white shadow mb-8 border-b-4 border-green-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href={route('staff.dashboard')} className="font-bold text-xl text-green-600">
                                    Clinic CRM Staff
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href={route('staff.patients.index')}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                >
                                    患者管理
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">{auth.user.name} (スタッフ)</span>
                            <Link
                                href={route('staff.logout')}
                                method="post"
                                as="button"
                                className="text-red-600 hover:text-red-800"
                            >
                                ログアウト
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">患者編集: {patient.name}</h1>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                {/* Name */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        氏名
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        メールアドレス
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        電話番号
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
                                    </div>
                                </div>

                                {/* Birthday */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                                        生年月日
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="date"
                                            name="birthday"
                                            id="birthday"
                                            value={data.birthday}
                                            onChange={(e) => setData('birthday', e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.birthday && <div className="text-red-600 text-sm mt-1">{errors.birthday}</div>}
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                        性別
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="">選択してください</option>
                                            <option value="男性">男性</option>
                                            <option value="女性">女性</option>
                                            <option value="その他">その他</option>
                                        </select>
                                        {errors.gender && <div className="text-red-600 text-sm mt-1">{errors.gender}</div>}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="sm:col-span-6">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        住所
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="address"
                                            name="address"
                                            rows={3}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.address && <div className="text-red-600 text-sm mt-1">{errors.address}</div>}
                                    </div>
                                </div>

                                {/* Referral Source */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="referral_source" className="block text-sm font-medium text-gray-700">
                                        紹介元
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="referral_source"
                                            id="referral_source"
                                            value={data.referral_source}
                                            onChange={(e) => setData('referral_source', e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.referral_source && <div className="text-red-600 text-sm mt-1">{errors.referral_source}</div>}
                                    </div>
                                </div>

                                {/* Consent Status */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="consent_status" className="block text-sm font-medium text-gray-700">
                                        同意状況
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="consent_status"
                                            name="consent_status"
                                            value={data.consent_status}
                                            onChange={(e) => setData('consent_status', e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        >
                                            <option value="">選択してください</option>
                                            <option value="未同意">未同意</option>
                                            <option value="同意済み">同意済み</option>
                                            <option value="保留">保留</option>
                                        </select>
                                        {errors.consent_status && <div className="text-red-600 text-sm mt-1">{errors.consent_status}</div>}
                                    </div>
                                </div>

                                {/* Caution Flag */}
                                <div className="sm:col-span-6">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="caution_flag"
                                                name="caution_flag"
                                                type="checkbox"
                                                checked={data.caution_flag}
                                                onChange={(e) => setData('caution_flag', e.target.checked)}
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="caution_flag" className="font-medium text-gray-700">
                                                注意フラグ
                                            </label>
                                            <p className="text-gray-500">この患者に特別な注意が必要な場合にチェックしてください。</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Caution Details */}
                                {data.caution_flag && (
                                    <div className="sm:col-span-6">
                                        <label htmlFor="caution_details" className="block text-sm font-medium text-red-700">
                                            注意詳細
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                id="caution_details"
                                                name="caution_details"
                                                rows={3}
                                                value={data.caution_details}
                                                onChange={(e) => setData('caution_details', e.target.value)}
                                                className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-red-300 rounded-md"
                                            />
                                            {errors.caution_details && <div className="text-red-600 text-sm mt-1">{errors.caution_details}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-5">
                                <div className="flex justify-end">
                                    <Link
                                        href={route('staff.patients.show', patient.id)}
                                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        キャンセル
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        保存
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
