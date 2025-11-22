import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ reservations, currentStart, currentEnd }) {
    const { auth } = usePage().props;
    const [selectedReservation, setSelectedReservation] = useState(null);
    const { data, setData, put, processing } = useForm({
        reception_status: '',
    });

    const openModal = (reservation) => {
        setSelectedReservation(reservation);
        setData('reception_status', reservation.reception_status);
    };

    const closeModal = () => {
        setSelectedReservation(null);
    };

    const updateStatus = (e) => {
        e.preventDefault();
        put(route('staff.reservations.update', selectedReservation.id), {
            onSuccess: () => closeModal(),
        });
    };

    // 簡易的なカレンダー表示用
    const days = [];
    let d = new Date(currentStart);
    const end = new Date(currentEnd);
    while (d <= end) {
        days.push(new Date(d));
        d.setDate(d.getDate() + 1);
    }

    const statusOptions = [
        { value: 'pending', label: '未受付' },
        { value: 'checked_in', label: '来院済み' },
        { value: 'consulting', label: '診察中' },
        { value: 'accounting', label: '会計待ち' },
        { value: 'completed', label: '完了' },
        { value: 'cancelled', label: 'キャンセル' },
    ];

    return (
        <StaffLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">予約管理</h2>}
        >
            <Head title="予約管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-7 gap-4">
                            {days.map((day) => (
                                <div key={day.toISOString()} className="border p-2 min-h-[200px]">
                                    <div className="font-bold text-center mb-2">
                                        {day.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })}
                                    </div>
                                    <div className="space-y-2">
                                        {reservations
                                            .filter((res) => new Date(res.start).toDateString() === day.toDateString())
                                            .map((res) => (
                                                <div
                                                    key={res.id}
                                                    className={`p-2 rounded text-xs cursor-pointer hover:opacity-80 ${
                                                        res.reception_status === 'completed' ? 'bg-gray-200' :
                                                        res.reception_status === 'checked_in' ? 'bg-green-200' :
                                                        'bg-blue-100'
                                                    }`}
                                                    onClick={() => openModal(res)}
                                                >
                                                    <div className="font-semibold">{new Date(res.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                    <div>{res.user_name}</div>
                                                    <div>{res.menu_name}</div>
                                                    <div className="mt-1 font-bold text-gray-600">
                                                        {statusOptions.find(o => o.value === res.reception_status)?.label || res.reception_status}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 詳細モーダル */}
            {selectedReservation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-bold mb-4">予約詳細</h3>
                        <div className="mb-4 text-sm">
                            <p><strong>患者:</strong> {selectedReservation.user_name}</p>
                            <p><strong>メニュー:</strong> {selectedReservation.menu_name}</p>
                            <p><strong>時間:</strong> {new Date(selectedReservation.start).toLocaleString()} - {new Date(selectedReservation.end).toLocaleTimeString()}</p>
                            <p><strong>担当スタッフ:</strong> {selectedReservation.staff_name}</p>
                            <p><strong>部屋:</strong> {selectedReservation.room_name}</p>
                            <p><strong>機械:</strong> {selectedReservation.machine_name}</p>
                        </div>

                        <form onSubmit={updateStatus}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">受付ステータス</label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.reception_status}
                                    onChange={(e) => setData('reception_status', e.target.value)}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    onClick={closeModal}
                                >
                                    閉じる
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={processing}
                                >
                                    更新
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}