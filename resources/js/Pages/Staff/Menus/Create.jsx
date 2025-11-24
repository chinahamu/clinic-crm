import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create({ products, roomTypes, machineTypes, roles }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        duration_minutes: '',
        required_role: '',
        required_room_type: '',
        required_machine_type: '',
        num_tickets: 1,
        validity_period_days: '',
        product_ids: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.menus.store'));
    };

    const handleProductChange = (e) => {
        const id = parseInt(e.target.value);
        if (e.target.checked) {
            setData('product_ids', [...data.product_ids, id]);
        } else {
            setData('product_ids', data.product_ids.filter((pid) => pid !== id));
        }
    };

    return (
        <StaffLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">メニュー新規作成</h2>}
        >
            <Head title="メニュー新規作成" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">メニュー名</label>
                                <input
                                    type="text"
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">料金</label>
                                <input
                                    type="number"
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                />
                                {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">所要時間 (分)</label>
                                <input
                                    type="number"
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.duration_minutes}
                                    onChange={(e) => setData('duration_minutes', e.target.value)}
                                />
                                {errors.duration_minutes && <div className="text-red-500 text-xs mt-1">{errors.duration_minutes}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">回数 (チケット枚数)</label>
                                <input
                                    type="number"
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.num_tickets}
                                    onChange={(e) => setData('num_tickets', e.target.value)}
                                    min="1"
                                />
                                <p className="text-xs text-gray-500 mt-1">通常は1回。コースの場合は回数を指定してください。</p>
                                {errors.num_tickets && <div className="text-red-500 text-xs mt-1">{errors.num_tickets}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">有効期限 (日数)</label>
                                <input
                                    type="number"
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.validity_period_days}
                                    onChange={(e) => setData('validity_period_days', e.target.value)}
                                    placeholder="例: 90 (90日間)"
                                />
                                <p className="text-xs text-gray-500 mt-1">空欄の場合は無期限となります。</p>
                                {errors.validity_period_days && <div className="text-red-500 text-xs mt-1">{errors.validity_period_days}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">必須スタッフロール (任意)</label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.required_role}
                                    onChange={(e) => setData('required_role', e.target.value)}
                                >
                                    <option value="">指定なし</option>
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">必須部屋タイプ (任意)</label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.required_room_type}
                                    onChange={(e) => setData('required_room_type', e.target.value)}
                                >
                                    <option value="">指定なし</option>
                                    {roomTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">必須機械タイプ (任意)</label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.required_machine_type}
                                    onChange={(e) => setData('required_machine_type', e.target.value)}
                                >
                                    <option value="">指定なし</option>
                                    {machineTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">関連商品 (オプション/物販)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border p-4 rounded bg-gray-50">
                                    {products && products.length > 0 ? (
                                        products.map((product) => (
                                            <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={product.id}
                                                    checked={data.product_ids.includes(product.id)}
                                                    onChange={handleProductChange}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-gray-700">{product.name} (¥{product.price.toLocaleString()})</span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 col-span-3">登録されている商品がありません。</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    disabled={processing}
                                >
                                    作成
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}