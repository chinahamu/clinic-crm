import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthSelection({ onAuthenticated, onBack, menu, selectedDate, selectedTime, user }) {
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

            {user && (
                <div className="mb-8 bg-white rounded-2xl shadow-sm border border-primary-200 p-6 animate-fade-in">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                            {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">ログイン中</p>
                            <p className="font-bold text-gray-900">{user.name} 様</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onAuthenticated(user)}
                        className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        このアカウントで予約を確定する
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <div className="mt-6 text-center relative">
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 relative z-10">または別のアカウントで</span>
                        <div className="absolute top-1/2 left-0 w-full border-t border-gray-200 -z-0"></div>
                    </div>
                </div>
            )}

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
                    <div className="mb-8">
                        <a
                            href={route('auth.line')}
                            className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-[#06C755] hover:bg-[#05b34c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C755] transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.5 2 2 5.6 2 10c0 3.7 3.1 6.8 7.3 7.7 0 0 .5-.1.5.4 0 .5-.1 1.7-.1 2.2 0 .8.5 1.3.8.9 3.5-2.1 8-6.1 8-11.2C22 5.6 17.5 2 12 2z" />
                            </svg>
                            LINEでログイン / 新規登録
                        </a>
                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">またはメールアドレスで</span>
                            </div>
                        </div>
                    </div>
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
