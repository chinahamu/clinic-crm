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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">シフト管理</h2>}
        >
            <Head title="シフト管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* シフト登録フォーム */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium mb-4">シフト登録</h3>
                        <form onSubmit={submit} className="flex gap-4 items-end flex-wrap">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">スタッフ</label>
                                <select
                                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2">日付</label>
                                <input
                                    type="date"
                                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                />
                                {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">開始時間</label>
                                <input
                                    type="time"
                                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">終了時間</label>
                                <input
                                    type="time"
                                    className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                />
                            </div>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={processing}
                            >
                                追加
                            </button>
                        </form>
                    </div>

                    {/* シフト一覧（簡易カレンダー） */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* カレンダーページング */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                                <Link
                                    href={route('staff.shifts.index', { start: formatDate(prevStart) })}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded"
                                >
                                    前週
                                </Link>
                                <Link
                                    href={route('staff.shifts.index', { start: formatDate(new Date()) })}
                                    className="bg-white border hover:bg-gray-50 text-gray-800 font-semibold py-1 px-3 rounded"
                                >
                                    今日
                                </Link>
                                <Link
                                    href={route('staff.shifts.index', { start: formatDate(nextStart) })}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded"
                                >
                                    翌週
                                </Link>
                            </div>
                            <div className="text-sm text-gray-600">期間: {currentStart} ～ {currentEnd}</div>
                        </div>

                        <div className="grid grid-cols-7 gap-4">
                            {days.map((day) => (
                                <div key={day.toISOString()} className="border p-2 min-h-[200px]">
                                    <div className="font-bold text-center mb-2">
                                        {day.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })}
                                    </div>
                                    <div className="space-y-2">
                                        {shifts
                                            .filter((shift) => new Date(shift.start).toDateString() === day.toDateString())
                                            .map((shift) => (
                                                <div key={shift.id} className="bg-blue-100 p-2 rounded text-xs relative group">
                                                    <div className="font-semibold">{shift.staff_name}</div>
                                                    <div>
                                                        {new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                                        {new Date(shift.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <Link
                                                        href={route('staff.shifts.destroy', shift.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="absolute top-0 right-0 text-red-500 hover:text-red-700 hidden group-hover:block p-1"
                                                    >
                                                        ×
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}