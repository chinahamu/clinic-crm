import React from 'react';
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
            header="部屋編集"
        >
            <Head title="部屋編集" />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900">部屋情報を編集</h3>
                        <p className="text-sm text-gray-500 mt-1">部屋の名前や定員などを変更できます。</p>
                    </div>
                    
                    <div className="p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                                    部屋名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition duration-150 ease-in-out"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">
                                        タイプ
                                    </label>
                                    <input
                                        id="type"
                                        type="text"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition duration-150 ease-in-out"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    />
                                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="capacity">
                                        定員 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition duration-150 ease-in-out"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        required
                                    />
                                    {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                    この部屋を有効にする
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                                <Link
                                    href={route('staff.rooms.index')}
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    キャンセル
                                </Link>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                    disabled={processing}
                                >
                                    更新する
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
