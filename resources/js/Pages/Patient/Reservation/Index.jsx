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
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="font-bold text-xl text-primary-600 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {clinic.name}
                        </div>
                        <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {step === 'menu' && 'Step 1: メニュー選択'}
                            {step === 'date' && 'Step 2: 日時選択'}
                            {step === 'auth' && 'Step 3: ログイン・確認'}
                            {step === 'complete' && '予約完了'}
                        </div>
                    </div>
                </header>

                <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {step === 'menu' && (
                        <div className="animate-fade-in">
                            <div className="mb-8 text-center">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">メニューを選択してください</h1>
                                <p className="text-gray-500">ご希望の施術メニューをお選びください。</p>
                            </div>

                            <div className="grid gap-4">
                                {menus.length > 0 ? (
                                    menus.map((menu) => (
                                        <div
                                            key={menu.id}
                                            onClick={() => handleMenuSelect(menu)}
                                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary-500 hover:shadow-md hover:ring-1 hover:ring-primary-500 transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                            <div className="flex justify-between items-start pr-8">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                        {menu.name}
                                                    </h3>
                                                    {menu.description && (
                                                        <p className="text-gray-500 mt-1 text-sm">
                                                            {menu.description}
                                                        </p>
                                                    )}
                                                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs font-medium">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {menu.duration_minutes}分
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-lg font-bold text-primary-600">
                                                    ¥{menu.price.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
                                        <p className="text-gray-500">現在利用可能なメニューはありません。</p>
                                    </div>
                                )}
                            </div>
                        </div>
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
                        <div className="animate-fade-in text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-small">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">予約が完了しました</h2>
                            <p className="text-gray-500 mb-8">
                                ご予約ありがとうございます。<br />
                                当日はお気をつけてお越しください。
                            </p>
                            <div className="bg-gray-50 p-6 rounded-xl max-w-sm mx-auto mb-8 text-left border border-gray-100">
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-xs text-gray-500">日時</span>
                                        <span className="font-bold text-gray-900">{selectedDate} {selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-xs text-gray-500">メニュー</span>
                                        <span className="font-bold text-gray-900">{selectedMenu.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">金額</span>
                                        <span className="font-bold text-primary-600">¥{selectedMenu.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 max-w-xs mx-auto">
                                <a
                                    href={route('home')}
                                    className="block w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                                >
                                    マイページへ移動
                                </a>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-primary-600 font-bold hover:text-primary-800 text-sm transition-colors"
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
