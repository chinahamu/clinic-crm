import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="bg-gray-50 flex items-center justify-center min-h-screen p-4">
            <Head title="患者様ログイン" />
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                <div className="py-8 px-6 text-center border-b border-gray-100 bg-white">
                    <div className="mx-auto w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">患者様ログイン</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        ご登録のメールアドレスとパスワードを入力してください
                    </p>
                </div>

                <div className="p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                メールアドレス
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                required
                                autoFocus
                                autoComplete="username"
                                placeholder="example@email.com"
                            />
                            {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                    パスワード
                                </label>
                                {route().has('password.request') && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                                    >
                                        パスワードをお忘れですか？
                                    </Link>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                            />
                            {errors.password && <div className="mt-1 text-sm text-red-600">{errors.password}</div>}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember_me"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                                ログイン状態を保持する
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'ログイン中...' : 'ログイン'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">または</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a
                                href={route('auth.line')}
                                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-[#06C755] hover:bg-[#05b34c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06C755] transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.5 2 2 5.6 2 10c0 3.7 3.1 6.8 7.3 7.7 0 0 .5-.1.5.4 0 .5-.1 1.7-.1 2.2 0 .8.5 1.3.8.9 3.5-2.1 8-6.1 8-11.2C22 5.6 17.5 2 12 2z" />
                                </svg>
                                LINEでログイン
                            </a>
                        </div>
                        {errors.line && <div className="mt-2 text-sm text-red-600 text-center">{errors.line}</div>}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600">
                        アカウントをお持ちでない方は{' '}
                        <Link href={route('register')} className="font-medium text-primary-600 hover:text-primary-500">
                            新規登録
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
