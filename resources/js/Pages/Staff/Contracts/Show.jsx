import React, { useState } from 'react';
import { Head, usePage, Link, router, useForm } from '@inertiajs/react';

export default function Show({ patient, contract }) {
    const { auth } = usePage().props;
    const [showUsageForm, setShowUsageForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        used_count: 1,
        used_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const handleDelete = () => {
        if (confirm('本当にこの契約を削除しますか？')) {
            router.delete(route('staff.patients.contracts.destroy', [patient.id, contract.id]));
        }
    };

    const handleUsageSubmit = (e) => {
        e.preventDefault();
        post(route('staff.patients.contracts.usage.store', [patient.id, contract.id]), {
            onSuccess: () => {
                reset();
                setShowUsageForm(false);
            },
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Head title={`契約詳細: ${patient.name}`} />
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
                                <Link
                                    href={route('staff.patients.show', patient.id)}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                >
                                    {patient.name}
                                </Link>
                                <Link
                                    href={route('staff.patients.contracts.index', patient.id)}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                >
                                    契約管理
                                </Link>
                                <span className="inline-flex items-center px-1 pt-1 border-b-2 border-green-500 text-sm font-medium text-gray-900">
                                    契約詳細
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">{auth.user.name} (スタッフ)</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">契約詳細</h1>
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        削除
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">契約情報</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">メニュー</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contract.menu?.name}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">契約日</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(contract.contract_date).toLocaleDateString()}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">残回数 / 総回数</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className="font-bold text-indigo-600">{contract.remaining_count}</span> / {contract.total_count}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">金額</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contract.total_price.toLocaleString()}円</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">有効期限</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {contract.expiration_date ? new Date(contract.expiration_date).toLocaleDateString() : '-'}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">ステータス</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {contract.status === 'active' ? '有効' : contract.status}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">消化履歴</h3>
                        <button
                            onClick={() => setShowUsageForm(!showUsageForm)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {showUsageForm ? 'キャンセル' : '手動消化登録'}
                        </button>
                    </div>
                    
                    {showUsageForm && (
                        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-t border-gray-200">
                            <form onSubmit={handleUsageSubmit}>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="used_date" className="block text-sm font-medium text-gray-700">消化日</label>
                                        <input
                                            type="date"
                                            id="used_date"
                                            value={data.used_date}
                                            onChange={e => setData('used_date', e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.used_date && <div className="text-red-600 text-sm mt-1">{errors.used_date}</div>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="used_count" className="block text-sm font-medium text-gray-700">消化回数</label>
                                        <input
                                            type="number"
                                            id="used_count"
                                            value={data.used_count}
                                            onChange={e => setData('used_count', e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.used_count && <div className="text-red-600 text-sm mt-1">{errors.used_count}</div>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">備考</label>
                                        <input
                                            type="text"
                                            id="notes"
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        {errors.notes && <div className="text-red-600 text-sm mt-1">{errors.notes}</div>}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        登録
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="border-t border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消化日</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消化回数</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">予約ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備考</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contract.usages && contract.usages.length > 0 ? (
                                    contract.usages.map((usage) => (
                                        <tr key={usage.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(usage.used_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {usage.used_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {usage.reservation_id ? (
                                                    <Link href={route('staff.reservations.show', usage.reservation_id)} className="text-indigo-600 hover:text-indigo-900">
                                                        #{usage.reservation_id}
                                                    </Link>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {usage.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            消化履歴はありません。
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
