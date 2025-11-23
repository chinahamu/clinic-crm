import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthSelection({ onAuthenticated, onBack, menu, selectedDate, selectedTime }) {
    const [mode, setMode] = useState('login'); // 'login' or 'register'

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-4"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    日時選択に戻る
                </button>
                <h2 className="text-xl font-bold text-slate-900">予約の確定</h2>
                <p className="text-slate-600 mt-1">
                    以下の内容で予約を進めます。
                </p>
                <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-slate-500">メニュー</span>
                            <span className="font-bold text-slate-900">{menu.name}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500">日時</span>
                            <span className="font-bold text-slate-900">{selectedDate} {selectedTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <button
                        className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${mode === 'login'
                                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                                : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                            }`}
                        onClick={() => setMode('login')}
                    >
                        ログインして予約
                    </button>
                    <button
                        className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${mode === 'register'
                                ? 'bg-white text-green-600 border-b-2 border-green-600'
                                : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                            }`}
                        onClick={() => setMode('register')}
                    >
                        会員登録して予約
                    </button>
                </div>

                <div className="p-6">
                    {mode === 'login' ? (
                        <div className="max-w-md mx-auto">
                            <p className="text-sm text-slate-600 mb-6 text-center">
                                すでにアカウントをお持ちの方は、ログインして予約を完了してください。
                            </p>
                            <LoginForm onSuccess={onAuthenticated} />
                        </div>
                    ) : (
                        <div className="max-w-md mx-auto">
                            <p className="text-sm text-slate-600 mb-6 text-center">
                                初めての方は、会員登録を行ってください。
                            </p>
                            <RegisterForm onSuccess={onAuthenticated} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
