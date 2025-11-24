import React from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ shifts, staffList, currentStart, currentEnd }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        staff_id: '',
        date: '',
        start_time: '09:00',
        end_time: '18:00',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.shifts.store'), {
            onSuccess: () => reset(),
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

    // ページング用の日付計算
    const formatDate = (dt) => dt.toISOString().slice(0, 10);
    const startDate = new Date(currentStart);
    const prevStart = new Date(startDate);
    prevStart.setDate(prevStart.getDate() - 7);
    const nextStart = new Date(startDate);
    nextStart.setDate(nextStart.getDate() + 7);

    return (
        <StaffLayout
            user={auth.user}
            header="シフト管理"
        >
            <Head title="シフト管理" />

            <div className="space-y-6">
                {/* シフト登録フォーム */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            シフト登録
                        </h3>
                    </div>
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">スタッフ</label>
                            <select
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg"
                                value={data.staff_id}
                                onChange={(e) => setData('staff_id', e.target.value)}
                            >
                                <option value="">選択してください</option>
                                {staffList.map((staff) => (
                                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                                ))}
                            </select>
                            {errors.staff_id && <div className="text-red-500 text-xs mt-1">{errors.staff_id}</div>}
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">日付</label>
                            <input
                                type="date"
                                className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                            />
                            {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">開始時間</label>
                            <input
                                type="time"
                                className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">終了時間</label>
                            <input
                                type="time"
                                className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <button
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                                disabled={processing}
                            >
                                追加する
                            </button>
                        </div>
                    </form>
                </div>

                {/* シフト一覧（簡易カレンダー） */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    {/* カレンダーヘッダー */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                        <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                            <Link
                                href={route('staff.shifts.index', { start: formatDate(prevStart) })}
                                className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div className="text-sm font-bold text-gray-900 min-w-[200px] text-center">
                                {new Date(currentStart).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })} 
                                <span className="mx-2 text-gray-400">～</span>
                                {new Date(currentEnd).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                            </div>
                            <Link
                                href={route('staff.shifts.index', { start: formatDate(nextStart) })}
                                className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <Link
                            href={route('staff.shifts.index', { start: formatDate(new Date()) })}
                            className="px-4 py-2 bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-all text-center"
                        >
                            今日へ移動
                        </Link>
                    </div>

                    <div className="grid grid-cols-7 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50">
                        {days.map((day) => (
                            <div key={day.toISOString()} className="py-3 text-center">
                                <span className={`text-sm font-semibold ${
                                    day.toDateString() === new Date().toDateString() ? 'text-primary-600' : 'text-gray-900'
                                }`}>
                                    {day.toLocaleDateString('ja-JP', { weekday: 'short' })}
                                </span>
                                <div className={`mt-1 mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                                    day.toDateString() === new Date().toDateString() ? 'bg-primary-600 text-white shadow-md' : 'text-gray-900'
                                }`}>
                                    {day.getDate()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 divide-x divide-gray-100 min-h-[400px]">
                        {days.map((day) => (
                            <div key={day.toISOString()} className="p-2 space-y-2 hover:bg-gray-50/50 transition-colors">
                                {shifts
                                    .filter((shift) => new Date(shift.start).toDateString() === day.toDateString())
                                    .map((shift) => (
                                        <div key={shift.id} className="relative group bg-blue-50 border border-blue-100 p-2 rounded-lg hover:shadow-md transition-all">
                                            <div className="font-bold text-xs text-blue-900 mb-1 truncate">{shift.staff_name}</div>
                                            <div className="text-[10px] font-medium text-blue-700 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                                {new Date(shift.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <Link
                                                href={route('staff.shifts.destroy', shift.id)}
                                                method="delete"
                                                as="button"
                                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}