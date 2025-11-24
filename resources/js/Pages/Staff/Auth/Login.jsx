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
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition duration-150 ease-in-out"
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
            
            <div className="mt-8 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Clinic CRM. All rights reserved.
            </div>
        </div>
    );
}
