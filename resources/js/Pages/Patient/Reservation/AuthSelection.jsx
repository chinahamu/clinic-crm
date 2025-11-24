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
                    className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 mb-4 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    日時選択に戻る
                </button>
                <h2 className="text-xl font-bold text-gray-900">予約の確定</h2>
                <p className="text-gray-500 mt-1">
                    以下の内容で予約を進めます。
                </p>
                <div className="mt-4 bg-primary-50 p-4 rounded-xl border border-primary-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-gray-500 text-xs mb-1">メニュー</span>
                            <span className="font-bold text-gray-900 text-base">{menu.name}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs mb-1">日時</span>
                            <span className="font-bold text-gray-900 text-base">{selectedDate} {selectedTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    <button
                        className={`flex-1 py-4 text-sm font-bold text-center transition-all duration-200 ${mode === 'login'
                                ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                                : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                        onClick={() => setMode('login')}
                    >
                        ログインして予約
                    </button>
                    <button
                        className={`flex-1 py-4 text-sm font-bold text-center transition-all duration-200 ${mode === 'register'
                                ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                                : 'bg-gray-50 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                        onClick={() => setMode('register')}
                    >
                        会員登録して予約
                    </button>
                </div>

                <div className="p-8">
                    {mode === 'login' ? (
                        <div className="max-w-md mx-auto animate-fade-in">
                            <p className="text-sm text-gray-500 mb-6 text-center">
                                すでにアカウントをお持ちの方は、ログインして予約を完了してください。
                            </p>
                            <LoginForm onSuccess={onAuthenticated} />
                        </div>
                    ) : (
                        <div className="max-w-md mx-auto animate-fade-in">
                            <p className="text-sm text-gray-500 mb-6 text-center">
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
