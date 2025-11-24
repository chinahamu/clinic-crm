import React, { useState } from 'react';
import { Head, usePage, Link, useForm } from '@inertiajs/react';

export default function Show({ patient, menus }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        menu_id: '',
        contract_date: new Date().toISOString().split('T')[0],
    });

    const [showContractForm, setShowContractForm] = useState(false);

    const submitContract = (e) => {
        e.preventDefault();
        post(route('staff.patients.contracts.store', patient.id), {
            onSuccess: () => {
                reset();
                setShowContractForm(false);
            },
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Head title={`患者詳細: ${patient.name}`} />
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
                    <h1 className="text-2xl font-semibold text-gray-900">患者詳細: {patient.name}</h1>
                    <div className="flex">
                        <Link
                            href={route('staff.documents.sign', patient.id)}
                            className="mr-3 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            電子署名
                        </Link>
                        <Link
                            href={route('staff.patients.edit', patient.id)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            編集
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">基本情報</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">個人情報と連絡先</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">氏名</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.name}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.email}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.phone || '-'}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">生年月日</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.birthday || '-'}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">性別</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.gender || '-'}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">住所</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.address || '-'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">管理情報</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">クリニック管理用データ</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">紹介元</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.referral_source || '-'}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">同意状況</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.consent_status || '-'}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">注意フラグ</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {patient.caution_flag ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            注意あり
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            なし
                                        </span>
                                    )}
                                </dd>
                            </div>
                            {patient.caution_flag && (
                                <div className="bg-red-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-red-800">注意詳細</dt>
                                    <dd className="mt-1 text-sm text-red-900 sm:mt-0 sm:col-span-2">{patient.caution_details}</dd>
                                </div>
                            )}
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">最終来院日</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.last_visit_at || '-'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">契約・役務情報</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">保有しているコース・チケット</p>
                        </div>
                        <button
                            onClick={() => setShowContractForm(!showContractForm)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                        >
                            {showContractForm ? 'キャンセル' : '新規契約登録'}
                        </button>
                    </div>

                    {showContractForm && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                            <form onSubmit={submitContract} className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">メニュー選択</label>
                                    <select
                                        value={data.menu_id}
                                        onChange={(e) => setData('menu_id', e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        required
                                    >
                                        <option value="">選択してください</option>
                                        {menus.map((menu) => (
                                            <option key={menu.id} value={menu.id}>
                                                {menu.name} ({menu.num_tickets || 1}回 / ¥{menu.price.toLocaleString()})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.menu_id && <div className="text-red-500 text-xs mt-1">{errors.menu_id}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">契約日</label>
                                    <input
                                        type="date"
                                        value={data.contract_date}
                                        onChange={(e) => setData('contract_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.contract_date && <div className="text-red-500 text-xs mt-1">{errors.contract_date}</div>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
                                >
                                    登録
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="border-t border-gray-200">
                        {patient.contracts && patient.contracts.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            メニュー名
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            残回数 / 総回数
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            有効期限
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ステータス
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">操作</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {patient.contracts.map((contract) => (
                                        <tr key={contract.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {contract.menu ? contract.menu.name : '不明なメニュー'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="font-bold text-gray-900">{contract.remaining_count}</span> / {contract.total_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {contract.expiration_date || '無期限'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {contract.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={route('staff.patients.contracts.destroy', [patient.id, contract.id])}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => confirm('本当に削除しますか？')}
                                                >
                                                    削除
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                契約情報はありません。
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
