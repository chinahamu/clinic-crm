import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, room }) {
    const { data, setData, put, processing, errors } = useForm({
        name: room.name,
        type: room.type || '',
        capacity: room.capacity,
        is_active: Boolean(room.is_active),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('staff.rooms.update', room.id));
    };

    return (
        <StaffLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">部屋編集</h2>}
        >
            <Head title="部屋編集" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                        部屋名
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <div className="text-red-500 text-xs italic">{errors.name}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                                        タイプ
                                    </label>
                                    <input
                                        id="type"
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    />
                                    {errors.type && <div className="text-red-500 text-xs italic">{errors.type}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
                                        定員
                                    </label>
                                    <input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        required
                                    />
                                    {errors.capacity && <div className="text-red-500 text-xs italic">{errors.capacity}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-green-600"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                        />
                                        <span className="ml-2 text-gray-700">有効</span>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        更新
                                    </button>
                                    <Link
                                        href={route('staff.rooms.index')}
                                        className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-800"
                                    >
                                        キャンセル
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
