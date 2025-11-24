import React, { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Show({ auth, patient, contract }) {
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
        <StaffLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        契約詳細
                    </h2>
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:border-red-900 focus:ring ring-red-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm"
                    >
                        削除
                    </button>
                </div>
            }
        >
            <Head title={`契約詳細: ${patient.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* パンくずリスト */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                        <Link href={route('staff.patients.index')} className="hover:text-primary-600">患者一覧</Link>
                        <span>&gt;</span>
                        <Link href={route('staff.patients.show', patient.id)} className="hover:text-primary-600">{patient.name}</Link>
                        <span>&gt;</span>
                        <Link href={route('staff.patients.contracts.index', patient.id)} className="hover:text-primary-600">契約管理</Link>
                        <span>&gt;</span>
                        <span className="text-gray-900 font-medium">詳細</span>
                    </div>

                    {/* 契約情報カード */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                契約情報
                            </h3>
                        </div>
                        <div className="p-6">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">メニュー</dt>
                                    <dd className="mt-1 text-sm text-gray-900 font-semibold">{contract.menu?.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">契約日</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{new Date(contract.contract_date).toLocaleDateString()}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">残回数 / 総回数</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        <span className="font-bold text-primary-600 text-lg">{contract.remaining_count}</span> 
                                        <span className="text-gray-400 mx-1">/</span> 
                                        {contract.total_count}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">金額</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{contract.total_price.toLocaleString()}円</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">有効期限</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {contract.expiration_date ? new Date(contract.expiration_date).toLocaleDateString() : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">ステータス</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {contract.status === 'active' ? '有効' : contract.status}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* 消化履歴セクション */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                消化履歴
                            </h3>
                            <button
                                onClick={() => setShowUsageForm(!showUsageForm)}
                                className="inline-flex items-center px-3 py-1.5 border border-primary-100 text-xs font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                                {showUsageForm ? 'キャンセル' : '手動消化登録'}
                            </button>
                        </div>
                        
                        {showUsageForm && (
                            <div className="p-6 bg-gray-50 border-b border-gray-100 animate-fade-in">
                                <form onSubmit={handleUsageSubmit}>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                        <div>
                                            <label htmlFor="used_date" className="block text-sm font-medium text-gray-700 mb-1">消化日 <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                id="used_date"
                                                value={data.used_date}
                                                onChange={e => setData('used_date', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                            />
                                            {errors.used_date && <div className="mt-1 text-sm text-red-600">{errors.used_date}</div>}
                                        </div>
                                        <div>
                                            <label htmlFor="used_count" className="block text-sm font-medium text-gray-700 mb-1">消化回数 <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                id="used_count"
                                                value={data.used_count}
                                                onChange={e => setData('used_count', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                            />
                                            {errors.used_count && <div className="mt-1 text-sm text-red-600">{errors.used_count}</div>}
                                        </div>
                                        <div>
                                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">備考</label>
                                            <input
                                                type="text"
                                                id="notes"
                                                value={data.notes}
                                                onChange={e => setData('notes', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                                placeholder="メモなど"
                                            />
                                            {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
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
                        )}

                        <div className="overflow-x-auto">
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
                                            <tr key={usage.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(usage.used_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {usage.used_count}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {usage.reservation_id ? (
                                                        <Link href={route('staff.reservations.show', usage.reservation_id)} className="text-primary-600 hover:text-primary-900 hover:underline">
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
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
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
        </StaffLayout>
    );
}
