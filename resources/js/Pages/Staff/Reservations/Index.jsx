import React, { useState } from 'react';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ reservations, patientList, currentStart, currentEnd, filters }) {
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
        { value: 'pending', label: '未受付', color: 'bg-gray-100 text-gray-800' },
        { value: 'checked_in', label: '来院済み', color: 'bg-blue-100 text-blue-800' },
        { value: 'consulting', label: '診察中', color: 'bg-purple-100 text-purple-800' },
        { value: 'accounting', label: '会計待ち', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'completed', label: '完了', color: 'bg-green-100 text-green-800' },
        { value: 'cancelled', label: 'キャンセル', color: 'bg-red-100 text-red-800' },
    ];

    const getStatusColor = (status) => {
        const option = statusOptions.find(o => o.value === status);
        return option ? option.color : 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const option = statusOptions.find(o => o.value === status);
        return option ? option.label : status;
    };

    // ページング用の日付計算
    const formatDate = (dt) => dt.toISOString().slice(0, 10);
    const startDate = new Date(currentStart);
    const prevStart = new Date(startDate);
    prevStart.setDate(prevStart.getDate() - 7);
    const nextStart = new Date(startDate);
    nextStart.setDate(nextStart.getDate() + 7);

    const handlePatientChange = (e) => {
        router.get(route('staff.reservations.index'), {
            start: currentStart,
            patient_id: e.target.value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <StaffLayout
            user={auth.user}
            header="予約管理"
        >
            <Head title="予約管理" />

            <div className="space-y-4 lg:space-y-6">
                {/* フィルタとコントロール */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4 lg:p-6">
                    <div className="flex flex-col gap-4">
                        {/* 患者フィルター */}
                        <div className="w-full lg:w-64">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">患者絞り込み</label>
                            <div className="relative">
                                <select
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg"
                                    value={filters.patient_id || ''}
                                    onChange={handlePatientChange}
                                >
                                    <option value="">全員表示</option>
                                    {patientList.map((patient) => (
                                        <option key={patient.id} value={patient.id}>{patient.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 日付ナビゲーション */}
                        <div className="flex items-center justify-between lg:justify-end gap-2 lg:gap-4 bg-gray-50 p-2 rounded-xl">
                            <Link
                                href={route('staff.reservations.index', { start: formatDate(prevStart), patient_id: filters.patient_id })}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div className="text-xs lg:text-sm font-bold text-gray-900 text-center flex-1 lg:flex-none lg:min-w-[200px]">
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
                                href={route('staff.reservations.index', { start: formatDate(nextStart), patient_id: filters.patient_id })}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <Link
                                href={route('staff.reservations.index', { start: formatDate(new Date()), patient_id: filters.patient_id })}
                                className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap"
                            >
                                今日
                            </Link>
                        </div>
                    </div>
                </div>

                {/* モバイル向けリストビュー */}
                <div className="block lg:hidden bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {days.map((day) => {
                            const dayReservations = reservations.filter(
                                (res) => new Date(res.start).toDateString() === day.toDateString()
                            );
                            return (
                                <div key={day.toISOString()}>
                                    {/* 日付ヘッダー */}
                                    <div className={`px-4 py-3 sticky top-0 z-10 ${
                                        day.toDateString() === new Date().toDateString() 
                                            ? 'bg-primary-50 border-l-4 border-primary-500' 
                                            : 'bg-gray-50'
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${
                                                day.toDateString() === new Date().toDateString() ? 'text-primary-700' : 'text-gray-900'
                                            }`}>
                                                {day.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })}
                                            </span>
                                            {dayReservations.length > 0 && (
                                                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                                                    {dayReservations.length}件
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* 予約リスト */}
                                    {dayReservations.length > 0 ? (
                                        <div className="divide-y divide-gray-50">
                                            {dayReservations.map((res) => (
                                                <div
                                                    key={res.id}
                                                    onClick={() => openModal(res)}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-bold text-gray-900">
                                                                    {new Date(res.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getStatusColor(res.reception_status)}`}>
                                                                    {getStatusLabel(res.reception_status)}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm font-bold text-gray-800">{res.user_name}</div>
                                                            <div className="text-xs text-gray-500">{res.menu_name}</div>
                                                        </div>
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-400 text-center">予約なし</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* デスクトップ向けカレンダーグリッド */}
                <div className="hidden lg:block bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
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
                    <div className="grid grid-cols-7 divide-x divide-gray-100 min-h-[600px]">
                        {days.map((day) => (
                            <div key={day.toISOString()} className="p-2 space-y-2 hover:bg-gray-50/50 transition-colors">
                                {reservations
                                    .filter((res) => new Date(res.start).toDateString() === day.toDateString())
                                    .map((res) => (
                                        <div
                                            key={res.id}
                                            onClick={() => openModal(res)}
                                            className={`group p-3 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-md cursor-pointer transition-all duration-200 ${
                                                res.reception_status === 'completed' ? 'bg-gray-50 opacity-75' :
                                                res.reception_status === 'checked_in' ? 'bg-blue-50 border-blue-100' :
                                                res.reception_status === 'consulting' ? 'bg-purple-50 border-purple-100' :
                                                'bg-white border-gray-100 shadow-sm'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-gray-900">
                                                    {new Date(res.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getStatusColor(res.reception_status)}`}>
                                                    {getStatusLabel(res.reception_status)}
                                                </span>
                                            </div>
                                            <div className="text-sm font-bold text-gray-800 truncate mb-0.5">
                                                {res.user_name}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {res.menu_name}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 詳細モーダル */}
            {selectedReservation && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full mx-4 sm:mx-auto">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                                            予約詳細
                                        </h3>
                                        <div className="mt-4 space-y-3">
                                            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">患者名</span>
                                                    <span className="text-sm font-bold text-gray-900">{selectedReservation.user_name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">日時</span>
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {new Date(selectedReservation.start).toLocaleString('ja-JP', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">メニュー</span>
                                                    <span className="text-sm font-bold text-gray-900">{selectedReservation.menu_name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">担当スタッフ</span>
                                                    <span className="text-sm font-bold text-gray-900">{selectedReservation.staff_name || '-'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">部屋</span>
                                                    <span className="text-sm font-bold text-gray-900">{selectedReservation.room_name || '-'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">機器</span>
                                                    <span className="text-sm font-bold text-gray-900">{selectedReservation.machine_name || '-'}</span>
                                                </div>
                                            </div>

                                            <form onSubmit={updateStatus} className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">受付ステータス変更</label>
                                                <select
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg"
                                                    value={data.reception_status}
                                                    onChange={(e) => setData('reception_status', e.target.value)}
                                                >
                                                    {statusOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                
                                                <div className="mt-6 flex flex-col-reverse sm:flex-row-reverse gap-2">
                                                    <button
                                                        type="submit"
                                                        className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto sm:text-sm"
                                                        disabled={processing}
                                                    >
                                                        更新する
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto sm:text-sm"
                                                        onClick={closeModal}
                                                    >
                                                        キャンセル
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}