import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ shifts, shiftRequests, staffList, currentStart, currentEnd }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'request'

    // Shift Creation Form
    const { data, setData, post, processing, errors, reset } = useForm({
        staff_id: '',
        date: '',
        start_time: '09:00',
        end_time: '18:00',
    });

    // Shift Request Form
    const { data: requestData, setData: setRequestData, post: postRequest, processing: requestProcessing, errors: requestErrors, reset: resetRequest } = useForm({
        staff_id: auth.user.id,
        requests: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.shifts.store'), {
            onSuccess: () => reset(),
        });
    };

    const submitRequest = (e) => {
        e.preventDefault();
        postRequest(route('staff.shifts.requests.store'), {
            onSuccess: () => {
                // Optional: Show success message or redirect
            },
        });
    };

    const generateShifts = () => {
        if (confirm('この期間のシフトを自動生成しますか？')) {
            post(route('staff.shifts.generate'), {
                data: {
                    start: currentStart,
                    end: currentEnd,
                },
            });
        }
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

    // Initialize requests if empty
    React.useEffect(() => {
        if (requestData.requests.length === 0 && days.length > 0) {
            const initialRequests = days.map(day => {
                const dateStr = formatDate(day);
                const existing = shiftRequests.find(r => r.date === dateStr && r.staff_id === auth.user.id);
                return {
                    date: dateStr,
                    start_time: existing?.start_time ? existing.start_time.slice(0, 5) : '',
                    end_time: existing?.end_time ? existing.end_time.slice(0, 5) : '',
                    is_holiday: existing?.is_holiday || false,
                    note: existing?.note || '',
                };
            });
            setRequestData('requests', initialRequests);
        }
    }, [currentStart, shiftRequests]);

    const updateRequest = (index, field, value) => {
        const newRequests = [...requestData.requests];
        newRequests[index][field] = value;
        setRequestData('requests', newRequests);
    };

    return (
        <StaffLayout
            user={auth.user}
            header="シフト管理"
        >
            <Head title="シフト管理" />

            <div className="space-y-4 lg:space-y-6">
                {/* Tabs */}
                <div className="flex justify-between items-center border-b border-gray-200">
                    <div className="flex space-x-4">
                        <button
                            className={`py-2 px-4 font-semibold ${activeTab === 'list' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('list')}
                        >
                            シフト一覧
                        </button>
                        <button
                            className={`py-2 px-4 font-semibold ${activeTab === 'request' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('request')}
                        >
                            希望提出
                        </button>
                    </div>
                    {activeTab === 'list' && (
                        <button
                            onClick={generateShifts}
                            className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            AI自動生成
                        </button>
                    )}
                </div>

                {activeTab === 'list' && (
                    <>
                        {/* シフト登録フォーム */}
                        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4 lg:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    シフト登録
                                </h3>
                            </div>
                            <form onSubmit={submit} className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:items-end">
                                <div>
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
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">日付</label>
                                    <input
                                        type="date"
                                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                    />
                                    {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">開始時間</label>
                                    <input
                                        type="time"
                                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">終了時間</label>
                                    <input
                                        type="time"
                                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                    />
                                </div>
                                <div>
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
                            <div className="p-4 border-b border-gray-100 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between bg-gray-50/50">
                                <div className="flex items-center justify-between lg:justify-start gap-2 lg:gap-4 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                                    <Link
                                        href={route('staff.shifts.index', { start: formatDate(prevStart) })}
                                        className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </Link>
                                    <div className="text-xs lg:text-sm font-bold text-gray-900 lg:min-w-[200px] text-center flex-1 lg:flex-initial">
                                        <span className="hidden sm:inline">
                                            {new Date(currentStart).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                                            <span className="mx-2 text-gray-400">～</span>
                                            {new Date(currentEnd).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                                        </span>
                                        <span className="sm:hidden">
                                            {new Date(currentStart).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })} ～ {new Date(currentEnd).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                                        </span>
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

                            {/* モバイル向けリストビュー */}
                            <div className="block lg:hidden divide-y divide-gray-100">
                                {days.map((day) => {
                                    const dayShifts = shifts.filter(
                                        (shift) => new Date(shift.start).toDateString() === day.toDateString()
                                    );
                                    return (
                                        <div key={day.toISOString()}>
                                            <div className={`px-4 py-3 sticky top-0 z-10 ${day.toDateString() === new Date().toDateString()
                                                ? 'bg-primary-50 border-l-4 border-primary-500'
                                                : 'bg-gray-50'
                                                }`}>
                                                <span className={`text-sm font-bold ${day.toDateString() === new Date().toDateString() ? 'text-primary-700' : 'text-gray-900'
                                                    }`}>
                                                    {day.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })}
                                                </span>
                                            </div>
                                            {dayShifts.length > 0 ? (
                                                <div className="divide-y divide-gray-50">
                                                    {dayShifts.map((shift) => (
                                                        <div key={shift.id} className="px-4 py-3 flex items-center justify-between">
                                                            <div>
                                                                <div className="font-bold text-sm text-gray-900">{shift.staff_name}</div>
                                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    {new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                                    {new Date(shift.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                            <Link
                                                                href={route('staff.shifts.destroy', shift.id)}
                                                                method="delete"
                                                                as="button"
                                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-gray-400 text-center">シフトなし</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* デスクトップ向けカレンダービュー */}
                            <div className="hidden lg:block">
                                <div className="grid grid-cols-7 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50">
                                    {days.map((day) => (
                                        <div key={day.toISOString()} className="py-3 text-center">
                                            <span className={`text-sm font-semibold ${day.toDateString() === new Date().toDateString() ? 'text-primary-600' : 'text-gray-900'
                                                }`}>
                                                {day.toLocaleDateString('ja-JP', { weekday: 'short' })}
                                            </span>
                                            <div className={`mt-1 mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${day.toDateString() === new Date().toDateString() ? 'bg-primary-600 text-white shadow-md' : 'text-gray-900'
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
                                                    <div
                                                        key={shift.id}
                                                        className={`relative group p-2 rounded-lg hover:shadow-md transition-all ${shift.status === 'draft'
                                                            ? 'bg-gray-100 border border-gray-200'
                                                            : 'bg-blue-50 border border-blue-100'
                                                            }`}
                                                    >
                                                        <div className={`font-bold text-xs mb-1 truncate ${shift.status === 'draft' ? 'text-gray-700' : 'text-blue-900'
                                                            }`}>
                                                            {shift.staff_name}
                                                            {shift.status === 'draft' && <span className="ml-1 text-[10px] text-gray-500">(案)</span>}
                                                        </div>
                                                        <div className={`text-[10px] font-medium flex items-center gap-1 ${shift.status === 'draft' ? 'text-gray-600' : 'text-blue-700'
                                                            }`}>
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
                    </>
                )}

                {activeTab === 'request' && (
                    <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4 lg:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">シフト希望提出</h3>
                            <div className="text-sm text-gray-500">
                                {new Date(currentStart).toLocaleDateString('ja-JP')} 〜 {new Date(currentEnd).toLocaleDateString('ja-JP')}
                            </div>
                        </div>
                        <form onSubmit={submitRequest} className="space-y-4">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">休み希望</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">開始時間</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">終了時間</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備考</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requestData.requests.map((req, index) => (
                                            <tr key={req.date}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(req.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                                                        checked={req.is_holiday}
                                                        onChange={(e) => updateRequest(index, 'is_holiday', e.target.checked)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="time"
                                                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                                                        value={req.start_time}
                                                        onChange={(e) => updateRequest(index, 'start_time', e.target.value)}
                                                        disabled={req.is_holiday}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="time"
                                                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                                                        value={req.end_time}
                                                        onChange={(e) => updateRequest(index, 'end_time', e.target.value)}
                                                        disabled={req.is_holiday}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        className="block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        value={req.note}
                                                        onChange={(e) => updateRequest(index, 'note', e.target.value)}
                                                        placeholder="備考"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                                    disabled={requestProcessing}
                                >
                                    希望を提出する
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}