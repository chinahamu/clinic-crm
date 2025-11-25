import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Edit({ clinic, schedules, exceptions }) {
    const { auth } = usePage().props;

    // Helper to get schedule for a specific day or default
    const getSchedule = (day) => {
        const found = schedules.find(s => s.day_of_week === day);
        return found ? {
            day_of_week: day,
            start_time: found.start_time ? found.start_time.substring(0, 5) : '09:00',
            end_time: found.end_time ? found.end_time.substring(0, 5) : '18:00',
            is_closed: !!found.is_closed,
        } : {
            day_of_week: day,
            start_time: '09:00',
            end_time: '18:00',
            is_closed: false,
        };
    };

    // Initialize form with 7 days (0-6)
    // We want to display Mon(1) to Sun(0) order usually? Or Sun(0) to Sat(6).
    // Let's do Mon(1) to Sun(0) as it's common for business.
    const daysOrder = [1, 2, 3, 4, 5, 6, 0];
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

    const { data, setData, put, processing, errors, reset } = useForm({
        schedules: daysOrder.map(day => getSchedule(day)),
        exceptions: exceptions.map(e => ({
            date: e.date,
            start_time: e.start_time ? e.start_time.substring(0, 5) : '',
            end_time: e.end_time ? e.end_time.substring(0, 5) : '',
            is_closed: !!e.is_closed,
            note: e.note || '',
        })),
    });

    const handleScheduleChange = (index, field, value) => {
        const newSchedules = [...data.schedules];
        newSchedules[index][field] = value;
        setData('schedules', newSchedules);
    };

    const handleExceptionChange = (index, field, value) => {
        const newExceptions = [...data.exceptions];
        newExceptions[index][field] = value;
        setData('exceptions', newExceptions);
    };

    const addException = () => {
        setData('exceptions', [
            ...data.exceptions,
            { date: '', start_time: '09:00', end_time: '18:00', is_closed: true, note: '' }
        ]);
    };

    const removeException = (index) => {
        const newExceptions = [...data.exceptions];
        newExceptions.splice(index, 1);
        setData('exceptions', newExceptions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('staff.settings.clinic.update'), {
            onSuccess: () => {
                // Optional: show toast
            },
        });
    };

    return (
        <StaffLayout
            user={auth.user}
            header="クリニック設定"
        >
            <Head title="クリニック設定" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Regular Hours */}
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">営業時間設定</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                曜日の営業時間を設定してください。
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            {data.schedules.map((schedule, index) => (
                                <div key={schedule.day_of_week} className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="w-16 font-bold text-gray-700">
                                        {dayLabels[schedule.day_of_week]}曜日
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={schedule.is_closed}
                                                onChange={(e) => handleScheduleChange(index, 'is_closed', e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">休診</span>
                                        </label>
                                    </div>
                                    {!schedule.is_closed && (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="time"
                                                value={schedule.start_time}
                                                onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)}
                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                            <span className="text-gray-500">~</span>
                                            <input
                                                type="time"
                                                value={schedule.end_time}
                                                onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)}
                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exceptions */}
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">臨時休診・特別営業時間</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    特定の日付の休診や営業時間を設定してください。
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addException}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                追加
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {data.exceptions.length === 0 && (
                                <p className="text-gray-500 text-sm">設定はありません。</p>
                            )}
                            {data.exceptions.map((exception, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <input
                                        type="date"
                                        value={exception.date}
                                        onChange={(e) => handleExceptionChange(index, 'date', e.target.value)}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={exception.is_closed}
                                            onChange={(e) => handleExceptionChange(index, 'is_closed', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">休診</span>
                                    </label>
                                    {!exception.is_closed && (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="time"
                                                value={exception.start_time}
                                                onChange={(e) => handleExceptionChange(index, 'start_time', e.target.value)}
                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                            <span className="text-gray-500">~</span>
                                            <input
                                                type="time"
                                                value={exception.end_time}
                                                onChange={(e) => handleExceptionChange(index, 'end_time', e.target.value)}
                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="備考"
                                        value={exception.note}
                                        onChange={(e) => handleExceptionChange(index, 'note', e.target.value)}
                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeException(index)}
                                        className="text-red-600 hover:text-red-900 text-sm"
                                    >
                                        削除
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            保存
                        </button>
                    </div>
                </form>
            </div>
        </StaffLayout>
    );
}
