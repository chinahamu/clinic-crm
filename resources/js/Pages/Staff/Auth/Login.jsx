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
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <Head title="スタッフログイン" />
            <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
                <div className="py-4 px-6 bg-green-600 text-white text-center font-bold text-xl">
                    スタッフログイン
                </div>
                <div className="p-6">
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                メールアドレス
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoFocus
                            />
                            {errors.email && <div className="text-red-500 text-xs italic mt-2">{errors.email}</div>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                パスワード
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <div className="text-red-500 text-xs italic mt-2">{errors.password}</div>}
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                disabled={processing}
                            >
                                ログイン
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
