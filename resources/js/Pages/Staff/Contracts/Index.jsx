import React, { useState } from 'react';
import { Head, usePage, Link, useForm } from '@inertiajs/react';

export default function Index({ patient, contracts, menus }) {
    const { auth } = usePage().props;
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
        <div className="bg-gray-100 min-h-screen">
            <Head title={`契約管理: ${patient.name}`} />
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
                                <span className="inline-flex items-center px-1 pt-1 border-b-2 border-green-500 text-sm font-medium text-gray-900">
                                    契約管理
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
                    <h1 className="text-2xl font-semibold text-gray-900">契約一覧: {patient.name}</h1>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        {showCreateForm ? 'キャンセル' : '新規契約登録'}
                    </button>
                </div>

                {showCreateForm && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">新規契約登録</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="menu_id" className="block text-sm font-medium text-gray-700">メニュー</label>
                                    <select
                                        id="menu_id"
                                        value={data.menu_id}
                                        onChange={handleMenuChange}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">選択してください</option>
                                        {menus.map(menu => (
                                            <option key={menu.id} value={menu.id}>{menu.name} ({menu.price.toLocaleString()}円)</option>
                                        ))}
                                    </select>
                                    {errors.menu_id && <div className="text-red-600 text-sm mt-1">{errors.menu_id}</div>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="contract_date" className="block text-sm font-medium text-gray-700">契約日</label>
                                    <input
                                        type="date"
                                        id="contract_date"
                                        value={data.contract_date}
                                        onChange={e => setData('contract_date', e.target.value)}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.contract_date && <div className="text-red-600 text-sm mt-1">{errors.contract_date}</div>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="total_count" className="block text-sm font-medium text-gray-700">回数</label>
                                    <input
                                        type="number"
                                        id="total_count"
                                        value={data.total_count}
                                        onChange={e => setData('total_count', e.target.value)}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.total_count && <div className="text-red-600 text-sm mt-1">{errors.total_count}</div>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="total_price" className="block text-sm font-medium text-gray-700">金額</label>
                                    <input
                                        type="number"
                                        id="total_price"
                                        value={data.total_price}
                                        onChange={e => setData('total_price', e.target.value)}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.total_price && <div className="text-red-600 text-sm mt-1">{errors.total_price}</div>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="expiration_date" className="block text-sm font-medium text-gray-700">有効期限</label>
                                    <input
                                        type="date"
                                        id="expiration_date"
                                        value={data.expiration_date}
                                        onChange={e => setData('expiration_date', e.target.value)}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                    {errors.expiration_date && <div className="text-red-600 text-sm mt-1">{errors.expiration_date}</div>}
                                </div>
                            </div>
                            <div className="mt-6">
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

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                                <tr key={contract.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(contract.contract_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {contract.menu?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="font-bold text-indigo-600">{contract.remaining_count}</span> / {contract.total_count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {contract.total_price.toLocaleString()}円
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {contract.expiration_date ? new Date(contract.expiration_date).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {contract.status === 'active' ? '有効' : contract.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={route('staff.patients.contracts.show', [patient.id, contract.id])} className="text-indigo-600 hover:text-indigo-900">
                                            詳細
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
