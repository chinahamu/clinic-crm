import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Edit({ product }) {
    const { auth } = usePage().props;
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        is_active: product.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.products.update', product.id));
    };

    const handleDelete = (e) => {
        e.preventDefault();
        if (confirm('本当に削除しますか？')) {
            destroy(route('staff.products.destroy', product.id));
        }
    };

    return (
        <StaffLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">商品編集</h2>}
        >
            <Head title="商品編集" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">商品名</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">説明</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">価格</label>
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={data.price}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        onChange={(e) => setData('price', e.target.value)}
                                    />
                                    {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">在庫数</label>
                                    <input
                                        id="stock"
                                        type="number"
                                        name="stock"
                                        value={data.stock}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        onChange={(e) => setData('stock', e.target.value)}
                                    />
                                    {errors.stock && <div className="text-red-500 text-xs mt-1">{errors.stock}</div>}
                                </div>

                                <div className="mb-4 block">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">有効</span>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        onClick={handleDelete}
                                        type="button"
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        削除
                                    </button>

                                    <div className="flex items-center">
                                        <Link
                                            href={route('staff.products.index')}
                                            className="text-sm text-gray-600 hover:text-gray-900 underline mr-4"
                                        >
                                            キャンセル
                                        </Link>

                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={processing}>
                                            更新
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
