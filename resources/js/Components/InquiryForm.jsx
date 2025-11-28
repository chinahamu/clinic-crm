import React from 'react';
import { useForm } from '@inertiajs/react';

export default function InquiryForm() {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '',
        company_name: '',
        email: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('inquiry.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="py-24 bg-white border-t border-slate-200" id="contact">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">お問い合わせ</h2>
                    <p className="text-slate-600">
                        導入のご相談、お見積もりなど、お気軽にお問い合わせください。<br />
                        通常1営業日以内に担当者よりご連絡いたします。
                    </p>
                </div>

                {wasSuccessful && (
                    <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-center">
                        お問い合わせを受け付けました。担当者よりご連絡いたします。
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                お名前 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="山田 太郎"
                                required
                            />
                            {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                        </div>
                        <div>
                            <label htmlFor="company_name" className="block text-sm font-medium text-slate-700 mb-1">
                                貴社名・クリニック名
                            </label>
                            <input
                                type="text"
                                id="company_name"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="〇〇クリニック"
                            />
                            {errors.company_name && <div className="mt-1 text-sm text-red-600">{errors.company_name}</div>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            メールアドレス <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="info@example.com"
                            required
                        />
                        {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                            お問い合わせ内容 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="message"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            rows="5"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="ご質問やご要望をご記入ください"
                            required
                        ></textarea>
                        {errors.message && <div className="mt-1 text-sm text-red-600">{errors.message}</div>}
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? '送信中...' : '送信する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
