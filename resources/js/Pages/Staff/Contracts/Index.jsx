import React, { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, patient, contracts, menus }) {
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        menu_id: '',
        contract_date: new Date().toISOString().split('T')[0],
        total_count: 1,
        total_price: 0,
        expiration_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('staff.patients.contracts.store', patient.id), {
            onSuccess: () => {
                reset();
                setShowCreateForm(false);
            },
        });
    };

    const handleMenuChange = (e) => {
        const menuId = e.target.value;
        const menu = menus.find(m => m.id == menuId);
        if (menu) {
            setData(data => ({
                ...data,
                menu_id: menuId,
                total_price: menu.price,
            }));
        } else {
            setData('menu_id', menuId);
        }
    };

    return (
        <StaffLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        契約一覧: {patient.name}
                    </h2>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:border-primary-900 focus:ring ring-primary-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm"
                    >
                        {showCreateForm ? 'キャンセル' : '新規契約登録'}
                    </button>
                </div>
            }
        >
            <Head title={`契約管理: ${patient.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* パンくずリスト的なナビゲーション */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                        <Link href={route('staff.patients.index')} className="hover:text-primary-600">患者一覧</Link>
                        <span>&gt;</span>
                        <Link href={route('staff.patients.show', patient.id)} className="hover:text-primary-600">{patient.name}</Link>
                        <span>&gt;</span>
                        <span className="text-gray-900 font-medium">契約管理</span>
                    </div>

                    {showCreateForm && (
                        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 animate-fade-in-down">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    新規契約登録
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label htmlFor="menu_id" className="block text-sm font-medium text-gray-700 mb-1">メニュー <span className="text-red-500">*</span></label>
                                        <select
                                            id="menu_id"
                                            value={data.menu_id}
                                            onChange={handleMenuChange}
                                            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        >
                                            <option value="">選択してください</option>
                                            {menus.map(menu => (
                                                <option key={menu.id} value={menu.id}>{menu.name} ({menu.price.toLocaleString()}円)</option>
                                            ))}
                                        </select>
                                        {errors.menu_id && <div className="mt-1 text-sm text-red-600">{errors.menu_id}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="contract_date" className="block text-sm font-medium text-gray-700 mb-1">契約日 <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            id="contract_date"
                                            value={data.contract_date}
                                            onChange={e => setData('contract_date', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        />
                                        {errors.contract_date && <div className="mt-1 text-sm text-red-600">{errors.contract_date}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="total_count" className="block text-sm font-medium text-gray-700 mb-1">回数 <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            id="total_count"
                                            value={data.total_count}
                                            onChange={e => setData('total_count', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        />
                                        {errors.total_count && <div className="mt-1 text-sm text-red-600">{errors.total_count}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="total_price" className="block text-sm font-medium text-gray-700 mb-1">金額 <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                id="total_price"
                                                value={data.total_price}
                                                onChange={e => setData('total_price', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors pr-8"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">円</span>
                                            </div>
                                        </div>
                                        {errors.total_price && <div className="mt-1 text-sm text-red-600">{errors.total_price}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="expiration_date" className="block text-sm font-medium text-gray-700 mb-1">有効期限</label>
                                        <input
                                            type="date"
                                            id="expiration_date"
                                            value={data.expiration_date}
                                            onChange={e => setData('expiration_date', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        />
                                        {errors.expiration_date && <div className="mt-1 text-sm text-red-600">{errors.expiration_date}</div>}
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-gray-100">
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

                    <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">契約日</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メニュー</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">残回数 / 総回数</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">有効期限</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">詳細</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {contracts.map((contract) => (
                                        <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(contract.contract_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {contract.menu?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="font-bold text-primary-600">{contract.remaining_count}</span> / {contract.total_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {contract.total_price.toLocaleString()}円
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {contract.expiration_date ? new Date(contract.expiration_date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    contract.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {contract.status === 'active' ? '有効' : contract.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link 
                                                    href={route('staff.patients.contracts.show', [patient.id, contract.id])} 
                                                    className="text-primary-600 hover:text-primary-900 font-semibold"
                                                >
                                                    詳細
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {contracts.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                契約データがありません。
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
