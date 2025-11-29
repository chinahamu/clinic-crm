import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create({ auth, medicines, consumables }) {
    const { data, setData, post, processing, errors } = useForm({
        item_type: 'medicine',
        item_id: '',
        quantity: '',
        operation: 'add',
    });

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (data.item_type === 'medicine') {
            setSelectedItems(medicines);
        } else {
            setSelectedItems(consumables);
        }
        setData('item_id', '');
    }, [data.item_type]);

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.inventories.store'));
    };

    return (
        <StaffLayout
            user={auth.user}
            header="在庫登録"
        >
            <Head title="在庫登録" />

            <div className="max-w-3xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            在庫登録・更新
                        </h3>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* 種別選択 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    種別 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="item_type"
                                            value="medicine"
                                            checked={data.item_type === 'medicine'}
                                            onChange={(e) => setData('item_type', e.target.value)}
                                            className="text-primary-600 focus:ring-primary-500 border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">薬剤</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="item_type"
                                            value="consumable"
                                            checked={data.item_type === 'consumable'}
                                            onChange={(e) => setData('item_type', e.target.value)}
                                            className="text-primary-600 focus:ring-primary-500 border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">消耗品</span>
                                    </label>
                                </div>
                                {errors.item_type && <div className="mt-1 text-sm text-red-600">{errors.item_type}</div>}
                            </div>

                            {/* アイテム選択 */}
                            <div>
                                <label htmlFor="item_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    対象アイテム <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="item_id"
                                    value={data.item_id}
                                    onChange={(e) => setData('item_id', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    required
                                >
                                    <option value="">選択してください</option>
                                    {selectedItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.item_id && <div className="mt-1 text-sm text-red-600">{errors.item_id}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 操作タイプ */}
                                <div>
                                    <label htmlFor="operation" className="block text-sm font-medium text-gray-700 mb-1">
                                        操作 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="operation"
                                        value={data.operation}
                                        onChange={(e) => setData('operation', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        required
                                    >
                                        <option value="add">入荷 (在庫を増やす)</option>
                                        <option value="subtract">使用 (在庫を減らす)</option>
                                        <option value="set">棚卸 (在庫数を指定する)</option>
                                    </select>
                                    {errors.operation && <div className="mt-1 text-sm text-red-600">{errors.operation}</div>}
                                </div>

                                {/* 数量 */}
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                        数量 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="quantity"
                                        type="number"
                                        min="0"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        placeholder="0"
                                        required
                                    />
                                    {errors.quantity && <div className="mt-1 text-sm text-red-600">{errors.quantity}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                            <Link
                                href={route('staff.inventories.index')}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                キャンセル
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:border-primary-900 focus:ring ring-primary-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm"
                            >
                                {processing ? '保存中...' : '保存する'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}
