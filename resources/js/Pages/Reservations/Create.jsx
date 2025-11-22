import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Create({ auth, menus }) {
    const { data, setData, post, processing, errors } = useForm({
        menu_id: '',
        start_time: '',
    });

    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        if (data.menu_id && selectedDate) {
            fetchSlots();
        }
    }, [data.menu_id, selectedDate]);

    const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
            const response = await axios.get(route('reservations.availability'), {
                params: {
                    menu_id: data.menu_id,
                    date: selectedDate,
                },
            });
            setSlots(response.data.slots);
        } catch (error) {
            console.error('Error fetching slots:', error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('reservations.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">新規予約</h2>}
        >
            <Head title="新規予約" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    メニュー選択
                                </label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.menu_id}
                                    onChange={(e) => setData('menu_id', e.target.value)}
                                >
                                    <option value="">選択してください</option>
                                    {menus.map((menu) => (
                                        <option key={menu.id} value={menu.id}>
                                            {menu.name} ({menu.duration_minutes}分) - ¥{menu.price}
                                        </option>
                                    ))}
                                </select>
                                {errors.menu_id && <div className="text-red-500 text-xs mt-1">{errors.menu_id}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    日付選択
                                </label>
                                <input
                                    type="date"
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {data.menu_id && selectedDate && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        時間選択
                                    </label>
                                    {loadingSlots ? (
                                        <p>空き状況を確認中...</p>
                                    ) : slots.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-2">
                                            {slots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    className={`py-2 px-4 rounded border ${
                                                        data.start_time.includes(slot)
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-white hover:bg-gray-100'
                                                    }`}
                                                    onClick={() => setData('start_time', `${selectedDate} ${slot}`)}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-red-500">空き枠がありません。</p>
                                    )}
                                    {errors.start_time && <div className="text-red-500 text-xs mt-1">{errors.start_time}</div>}
                                </div>
                            )}

                            <div className="flex items-center justify-end mt-4">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    disabled={processing}
                                >
                                    予約する
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}