import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function DateSelection({ clinic, menu, onBack, onSelect }) {
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
        onSelect(date, time);
    };

    if (!menu) return null;

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 mb-4 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    メニュー選択に戻る
                </button>
                <h2 className="text-xl font-bold text-gray-900">日時を選択してください</h2>
                <p className="text-gray-500 mt-1">
                    選択中のメニュー: <span className="font-semibold text-primary-600">{menu.name}</span> ({menu.duration_minutes}分)
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                </div>
            ) : availabilityData ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-center text-sm">
                            <thead>
                                <tr>
                                    <th className="p-3 border-b border-gray-100 bg-gray-50 text-gray-500 font-medium sticky left-0 z-10 min-w-[80px]">
                                        時間
                                    </th>
                                    {availabilityData.dates.map(date => (
                                        <th key={date} className="p-3 border-b border-gray-100 font-medium min-w-[100px] text-gray-700">
                                            {new Date(date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' })}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {availabilityData.slots.map(time => (
                                    <tr key={time} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 border-b border-gray-100 text-gray-500 font-mono sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                            {time}
                                        </td>
                                        {availabilityData.dates.map(date => {
                                            const isAvailable = availabilityData.availability[date]?.[time];
                                            return (
                                                <td key={`${date}-${time}`} className="p-2 border-b border-gray-100">
                                                    <button
                                                        onClick={() => handleSlotClick(date, time, isAvailable)}
                                                        disabled={!isAvailable}
                                                        className={`w-full h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${isAvailable
                                                            ? 'text-primary-600 hover:bg-primary-50 hover:scale-105 font-bold cursor-pointer border border-transparent hover:border-primary-200'
                                                            : 'text-gray-300 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {isAvailable ? (
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <span className="text-xl">×</span>
                                                        )}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                    データを読み込めませんでした。
                </div>
            )}
        </div>
    );
}
