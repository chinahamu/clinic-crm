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
            header="新規予約"
        >
            <Head title="新規予約" />

            <div className="space-y-4 lg:space-y-6">
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-4 lg:p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* メニュー選択 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    メニュー選択
                                </label>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base"
                                    value={data.menu_id}
                                    onChange={(e) => setData('menu_id', e.target.value)}
                                >
                                    <option value="">選択してください</option>
                                    {menus.map((menu) => (
                                        <option key={menu.id} value={menu.id}>
                                            {menu.name} ({menu.duration_minutes}分) - ¥{menu.price.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                                {errors.menu_id && <div className="text-red-500 text-xs mt-1">{errors.menu_id}</div>}
                            </div>

                            {/* 日付選択 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    日付選択
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {/* 時間選択 */}
                            {data.menu_id && selectedDate && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        時間選択
                                    </label>
                                    {loadingSlots ? (
                                        <div className="flex items-center justify-center p-4 text-gray-500">
                                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            空き状況を確認中...
                                        </div>
                                    ) : slots.length > 0 ? (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                            {slots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    className={`py-3 px-3 rounded-lg border text-sm font-medium transition-all ${
                                                        data.start_time.includes(slot)
                                                            ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                                            : 'bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                                                    }`}
                                                    onClick={() => setData('start_time', `${selectedDate} ${slot}`)}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                                            <p className="text-red-600 text-sm text-center">空き枠がありません。別の日付を選択してください。</p>
                                        </div>
                                    )}
                                    {errors.start_time && <div className="text-red-500 text-xs mt-1">{errors.start_time}</div>}
                                </div>
                            )}

                            {/* 送信ボタン */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                    disabled={processing || !data.menu_id || !data.start_time}
                                >
                                    {processing ? '予約中...' : '予約する'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}