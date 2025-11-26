import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import axios from 'axios';

export default function Create({ auth, menus }) {
    const { data, setData, post, processing, errors } = useForm({
        menu_id: '',
        start_time: '',
    });

    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [step, setStep] = useState(1); // 1: Selection, 2: Auth (if guest), 3: Confirmation
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

    // Auth Form State
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
        password_confirmation: '',
        name: '',
    });
    const [authErrors, setAuthErrors] = useState({});
    const [authProcessing, setAuthProcessing] = useState(false);

    useEffect(() => {
        if (data.menu_id && selectedDate) {
            fetchSlots();
        }
    }, [data.menu_id, selectedDate]);

    const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
            const response = await axios.get(route('reservations.availability'), {
                params: {
                    menu_id: data.menu_id,
                    date: selectedDate,
                },
            });
            setSlots(response.data.slots);
        } catch (error) {
            console.error('Error fetching slots:', error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSlotSelect = (slot) => {
        setData('start_time', `${selectedDate} ${slot}`);
    };

    const nextStep = () => {
        if (step === 1) {
            if (auth.user) {
                setStep(3); // Skip auth if logged in
            } else {
                setStep(2);
            }
        } else {
            setStep(step + 1);
        }
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthProcessing(true);
        setAuthErrors({});

        try {
            const routeName = authMode === 'login' ? 'login' : 'register';
            await axios.post(route(routeName), authData);
            // Reload page to get auth state, but keep form data? 
            // Better: just force reload or use Inertia to visit current page to refresh props
            window.location.reload();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setAuthErrors(error.response.data.errors);
            } else {
                console.error('Auth error:', error);
            }
        } finally {
            setAuthProcessing(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('reservations.store'));
    };

    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    const getMenuName = () => {
        const menu = menus.find(m => m.id == data.menu_id);
        return menu ? `${menu.name} (${menu.duration_minutes}分)` : '';
    };

    return (
        <Layout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">新規予約</h2>}
        >
            <Head title="新規予約" />

            <div className={`py-12 ${!auth.user ? 'bg-gray-100 min-h-screen' : ''}`}>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            {/* Progress Steps */}
                            <div className="mb-8">
                                <div className="flex items-center justify-center">
                                    <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'} mr-2`}>1</span>
                                        <span className="font-medium">日時選択</span>
                                    </div>
                                    <div className={`w-12 h-0.5 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                                    <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'} mr-2`}>2</span>
                                        <span className="font-medium">確認・予約</span>
                                    </div>
                                </div>
                            </div>

                            {step === 1 && (
                                <div className="space-y-6">
                                    {/* メニュー選択 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            メニュー選択
                                        </label>
                                        <select
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base"
                                            value={data.menu_id}
                                            onChange={(e) => setData('menu_id', e.target.value)}
                                        >
                                            <option value="">選択してください</option>
                                            {menus.map((menu) => (
                                                <option key={menu.id} value={menu.id}>
                                                    {menu.name} ({menu.duration_minutes}分) - ¥{menu.price.toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.menu_id && <div className="text-red-500 text-xs mt-1">{errors.menu_id}</div>}
                                    </div>

                                    {/* 日付選択 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            日付選択
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    {/* 時間選択 */}
                                    {data.menu_id && selectedDate && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                時間選択
                                            </label>
                                            {loadingSlots ? (
                                                <div className="flex items-center justify-center p-4 text-gray-500">
                                                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    空き状況を確認中...
                                                </div>
                                            ) : slots.length > 0 ? (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                                    {slots.map((slot) => (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            className={`py-3 px-3 rounded-lg border text-sm font-medium transition-all ${data.start_time.includes(slot)
                                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                                                    : 'bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                                                                }`}
                                                            onClick={() => handleSlotSelect(slot)}
                                                        >
                                                            {slot}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                                                    <p className="text-red-600 text-sm text-center">空き枠がありません。別の日付を選択してください。</p>
                                                </div>
                                            )}
                                            {errors.start_time && <div className="text-red-500 text-xs mt-1">{errors.start_time}</div>}
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                            disabled={!data.menu_id || !data.start_time}
                                            onClick={nextStep}
                                        >
                                            次へ進む
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && !auth.user && (
                                <div className="max-w-md mx-auto">
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex border-b mb-6">
                                            <button
                                                className={`flex-1 pb-2 text-center font-medium ${authMode === 'login' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
                                                onClick={() => setAuthMode('login')}
                                            >
                                                ログイン
                                            </button>
                                            <button
                                                className={`flex-1 pb-2 text-center font-medium ${authMode === 'register' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
                                                onClick={() => setAuthMode('register')}
                                            >
                                                新規登録
                                            </button>
                                        </div>

                                        <form onSubmit={handleAuthSubmit} className="space-y-4">
                                            {authMode === 'register' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">お名前</label>
                                                    <input
                                                        type="text"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                        value={authData.name}
                                                        onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                                                        required
                                                    />
                                                    {authErrors.name && <div className="text-red-500 text-xs mt-1">{authErrors.name}</div>}
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                                                <input
                                                    type="email"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                    value={authData.email}
                                                    onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                                                    required
                                                />
                                                {authErrors.email && <div className="text-red-500 text-xs mt-1">{authErrors.email}</div>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">パスワード</label>
                                                <input
                                                    type="password"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                    value={authData.password}
                                                    onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                                                    required
                                                />
                                                {authErrors.password && <div className="text-red-500 text-xs mt-1">{authErrors.password}</div>}
                                            </div>

                                            {authMode === 'register' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">パスワード（確認）</label>
                                                    <input
                                                        type="password"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                        value={authData.password_confirmation}
                                                        onChange={(e) => setAuthData({ ...authData, password_confirmation: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                                                disabled={authProcessing}
                                            >
                                                {authProcessing ? '処理中...' : (authMode === 'login' ? 'ログインして次へ' : '登録して次へ')}
                                            </button>
                                        </form>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">
                                            ← 日時選択に戻る
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(step === 3 || (step === 2 && auth.user)) && (
                                <div className="max-w-2xl mx-auto">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">予約内容の確認</h3>

                                    <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">メニュー</span>
                                            <span className="font-medium">{getMenuName()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">日時</span>
                                            <span className="font-medium">{data.start_time}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">お名前</span>
                                            <span className="font-medium">{auth.user?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">メールアドレス</span>
                                            <span className="font-medium">{auth.user?.email}</span>
                                        </div>
                                    </div>

                                    <form onSubmit={submit}>
                                        <button
                                            type="submit"
                                            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                                            disabled={processing}
                                        >
                                            {processing ? '予約を確定中...' : '予約を確定する'}
                                        </button>
                                    </form>

                                    <div className="mt-4 text-center">
                                        <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">
                                            ← 日時選択に戻る
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}