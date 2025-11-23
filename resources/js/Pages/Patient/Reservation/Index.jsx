import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DateSelection from './DateSelection';
import AuthSelection from './AuthSelection';
import axios from 'axios';

export default function Index({ clinic, menus }) {
    const { auth } = usePage().props;
    const [step, setStep] = useState('menu'); // menu, date, auth, complete
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [reservation, setReservation] = useState(null);

    const handleMenuSelect = (menu) => {
        setSelectedMenu(menu);
        setStep('date');
    };

    const handleDateSelect = (date, time) => {
        setSelectedDate(date);
        setSelectedTime(time);

        if (auth.user) {
            // If already logged in, proceed to reservation directly (or confirmation)
            createReservation(auth.user);
        } else {
            setStep('auth');
        }
    };

    const handleAuthenticated = (user) => {
        // User just logged in or registered
        createReservation(user);
    };

    const createReservation = async (user) => {
        if (!confirm(`${selectedDate} ${selectedTime} で予約を確定しますか？`)) {
            return;
        }

        try {
            const response = await axios.post(route('patient.reservation.store'), {
                clinic_code: clinic.code,
                menu_id: selectedMenu.id,
                start_date: selectedDate,
                start_time: selectedTime,
            });
            setReservation(response.data.reservation);
            setStep('complete');
        } catch (error) {
            console.error('Reservation failed:', error);
            alert('予約の作成に失敗しました。もう一度お試しください。');
        }
    };

    return (
        <>
            <Head title={`${clinic.name} - 予約`} />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="font-bold text-xl text-slate-900">
                            {clinic.name}
                        </div>
                        <div className="text-sm text-slate-500">
                            {step === 'menu' && 'メニュー選択'}
                            {step === 'date' && '日時選択'}
                            {step === 'auth' && 'ログイン・会員登録'}
                            {step === 'complete' && '予約完了'}
                        </div>
                    </div>
                </header>

                <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {step === 'menu' && (
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">メニューを選択してください</h1>
                                <p className="text-slate-600">ご希望の施術メニューをお選びください。</p>
                            </div>

                            <div className="grid gap-4">
                                {menus.length > 0 ? (
                                    menus.map((menu) => (
                                        <div
                                            key={menu.id}
                                            onClick={() => handleMenuSelect(menu)}
                                            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {menu.name}
                                                    </h3>
                                                    {menu.description && (
                                                        <p className="text-slate-600 mt-1 text-sm">
                                                            {menu.description}
                                                        </p>
                                                    )}
                                                    <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                                                        <div className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {menu.duration_minutes}分
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-lg font-bold text-slate-900">
                                                    ¥{menu.price.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                                        <p className="text-slate-500">現在利用可能なメニューはありません。</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {step === 'date' && (
                        <DateSelection
                            clinic={clinic}
                            menu={selectedMenu}
                            onBack={() => setStep('menu')}
                            onSelect={handleDateSelect}
                        />
                    )}

                    {step === 'auth' && (
                        <AuthSelection
                            menu={selectedMenu}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            onBack={() => setStep('date')}
                            onAuthenticated={handleAuthenticated}
                        />
                    )}

                    {step === 'complete' && (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">予約が完了しました</h2>
                            <p className="text-slate-600 mb-8">
                                ご予約ありがとうございます。<br />
                                当日はお気をつけてお越しください。
                            </p>
                            <div className="bg-slate-50 p-6 rounded-lg max-w-sm mx-auto mb-8 text-left">
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-slate-500 block">日時</span>
                                        <span className="font-bold text-slate-900">{selectedDate} {selectedTime}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 block">メニュー</span>
                                        <span className="font-bold text-slate-900">{selectedMenu.name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 max-w-xs mx-auto">
                                <a
                                    href={route('home')}
                                    className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
                                >
                                    マイページへ移動
                                </a>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-indigo-600 font-bold hover:underline text-sm"
                                >
                                    トップに戻る
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
