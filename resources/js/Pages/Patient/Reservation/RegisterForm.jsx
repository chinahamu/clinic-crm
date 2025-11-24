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
        <form onSubmit={submit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                    required
                    placeholder="山田 太郎"
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name[0]}</p>}
            </div>

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
                    placeholder="8文字以上"
                />
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">パスワード（確認）</label>
                <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                    required
                    placeholder="もう一度入力してください"
                />
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
            >
                {processing ? '登録中...' : '会員登録して予約'}
            </button>
        </form>
    );
}
