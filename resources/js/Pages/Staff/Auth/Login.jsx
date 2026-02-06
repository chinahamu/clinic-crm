import React from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.login'));
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-50">
            <Head title="スタッフログイン" />

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-xl overflow-hidden sm:rounded-2xl border border-gray-100">
                <div className="mb-8 text-center">
                    <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4">
                        S
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">スタッフログイン</h2>
                    <p className="text-sm text-gray-500 mt-2">Clinic CRM 管理画面へようこそ</p>
                </div>

                <form onSubmit={submit}>
                    <div>
                        <label className="block font-medium text-sm text-gray-700" htmlFor="email">
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-xl border-gray-300 py-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition duration-150 ease-in-out"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
                    </div>

                    <div className="mt-4">
                        <label className="block font-medium text-sm text-gray-700" htmlFor="password">
                            パスワード
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition duration-150 ease-in-out"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password}</p>}
                    </div>

                    <div className="block mt-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">ログイン状態を保持する</span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-6">
                        <button
                            className="w-full inline-flex items-center justify-center px-4 py-3 bg-primary-600 border border-transparent rounded-xl font-semibold text-sm text-white uppercase tracking-widest hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-md hover:shadow-lg"
                            disabled={processing}
                        >
                            ログイン
                        </button>
                    </div>
                </form>
            </div>

            <div className="w-full sm:max-w-md mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 shadow-sm">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    デモ用アカウント
                </h3>
                <div className="mb-4 bg-white p-4 rounded-lg border border-blue-100">
                    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2">
                        <span className="font-semibold text-blue-600">Email:</span>
                        <span className="font-mono text-slate-700">staff@example.com</span>
                        <span className="font-semibold text-blue-600">Pass:</span>
                        <span className="font-mono text-slate-700">password</span>
                    </div>
                </div>
                <div className="pt-4 border-t border-blue-200">
                    <p className="font-bold text-red-600 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        ご注意ください
                    </p>
                    <p className="leading-relaxed text-blue-900">
                        この環境は公開デモ環境です。登録・削除は自由に行っていただけますが、<span className="font-bold underline decoration-red-400 decoration-2">実際の個人情報や機密情報は絶対に入力しないでください。</span>
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Clinic CRM. All rights reserved.
            </div>
        </div>
    );
}
