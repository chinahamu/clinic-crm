import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function DateSelection({ clinic, menu, onBack }) {
    const [loading, setLoading] = useState(true);
    const [availabilityData, setAvailabilityData] = useState(null);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchAvailability();
    }, [startDate]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('patient.reservation.availability', { code: clinic.code }), {
                params: {
                    menu_id: menu.id,
                    start_date: startDate
                }
            });
            setAvailabilityData(response.data);
        } catch (error) {
            console.error('Error fetching availability:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotClick = (date, time, isAvailable) => {
        if (!isAvailable) return;

        if (confirm(`${date} ${time} で予約しますか？`)) {
            // Proceed to next step (e.g., confirmation or submit)
            // For now, just alert
            alert('予約機能はまだ実装されていません。');
        }
    };

    if (!menu) return null;

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-4"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    メニュー選択に戻る
                </button>
                <h2 className="text-xl font-bold text-slate-900">日時を選択してください</h2>
                <p className="text-slate-600 mt-1">
                    選択中のメニュー: <span className="font-semibold text-indigo-600">{menu.name}</span> ({menu.duration_minutes}分)
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : availabilityData ? (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-center text-sm">
                        <thead>
                            <tr>
                                <th className="p-2 border-b border-slate-200 bg-slate-50 text-slate-500 font-medium sticky left-0 z-10">
                                    時間
                                </th>
                                {availabilityData.dates.map(date => (
                                    <th key={date} className="p-2 border-b border-slate-200 font-medium min-w-[80px]">
                                        {new Date(date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' })}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {availabilityData.slots.map(time => (
                                <tr key={time} className="hover:bg-slate-50">
                                    <td className="p-2 border-b border-slate-100 text-slate-500 font-mono sticky left-0 bg-white z-10">
                                        {time}
                                    </td>
                                    {availabilityData.dates.map(date => {
                                        const isAvailable = availabilityData.availability[date]?.[time];
                                        return (
                                            <td key={`${date}-${time}`} className="p-2 border-b border-slate-100">
                                                <button
                                                    onClick={() => handleSlotClick(date, time, isAvailable)}
                                                    disabled={!isAvailable}
                                                    className={`w-full h-10 rounded-lg flex items-center justify-center transition-all ${isAvailable
                                                            ? 'text-indigo-600 hover:bg-indigo-50 hover:scale-110 font-bold cursor-pointer'
                                                            : 'text-slate-300 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {isAvailable ? '◎' : 'ー'}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    データを読み込めませんでした。
                </div>
            )}
        </div>
    );
}
