import React, { useState } from 'react';
import axios from 'axios';

export default function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(route('patient.login'), {
                email,
                password,
            });
            onSuccess(response.data.user);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Login failed:', error);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                    required
                    placeholder="example@email.com"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                    required
                    placeholder="••••••••"
                />
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
            >
                {processing ? 'ログイン中...' : 'ログインして予約'}
            </button>
        </form>
    );
}
