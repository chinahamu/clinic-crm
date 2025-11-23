import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterForm({ onSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(route('patient.register'), {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            onSuccess(response.data.user);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Registration failed:', error);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">お名前</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">パスワード</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">パスワード（確認）</label>
                <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
                {processing ? '登録中...' : '会員登録して予約'}
            </button>
        </form>
    );
}
