import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create({ auth, products, roomTypes, machines, roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        duration_minutes: '',
        required_role: '',
        required_room_type: '',
        required_machine_id: '',
        num_tickets: 1,
        validity_period_days: '',
        product_ids: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.menus.store'));
    };

    const handleProductChange = (e) => {
        const id = parseInt(e.target.value);
        if (e.target.checked) {
            setData('product_ids', [...data.product_ids, id]);
        } else {
            setData('product_ids', data.product_ids.filter((pid) => pid !== id));
        }
    };

    return (
        <StaffLayout
            user={auth.user}
            header="メニュー登録"
        >
            <Head title="メニュー登録" />

            <div className="max-w-3xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            新規メニュー登録
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            新しい施術メニューの情報を入力してください。
                        </p>
                    </div>

                    <form onSubmit={submit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* メニュー名 */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    メニュー名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    placeholder="例: 全身脱毛コース"
                                    required
                                />
                                {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 料金 */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                        料金 (円) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">¥</span>
                                        </div>
                                        <input
                                            id="price"
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="w-full pl-7 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    {errors.price && <div className="mt-1 text-sm text-red-600">{errors.price}</div>}
                                </div>

                                {/* 所要時間 */}
                                <div>
                                    <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                                        所要時間 (分) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            id="duration_minutes"
                                            type="number"
                                            value={data.duration_minutes}
                                            onChange={(e) => setData('duration_minutes', e.target.value)}
                                            className="w-full pr-10 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                            placeholder="60"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">分</span>
                                        </div>
                                    </div>
                                    {errors.duration_minutes && <div className="mt-1 text-sm text-red-600">{errors.duration_minutes}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 回数 */}
                                <div>
                                    <label htmlFor="num_tickets" className="block text-sm font-medium text-gray-700 mb-1">
                                        回数 (チケット枚数)
                                    </label>
                                    <input
                                        id="num_tickets"
                                        type="number"
                                        value={data.num_tickets}
                                        onChange={(e) => setData('num_tickets', e.target.value)}
                                        min="1"
                                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">通常は1回。コースの場合は回数を指定してください。</p>
                                    {errors.num_tickets && <div className="mt-1 text-sm text-red-600">{errors.num_tickets}</div>}
                                </div>

                                {/* 有効期限 */}
                                <div>
                                    <label htmlFor="validity_period_days" className="block text-sm font-medium text-gray-700 mb-1">
                                        有効期限 (日数)
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            id="validity_period_days"
                                            type="number"
                                            value={data.validity_period_days}
                                            onChange={(e) => setData('validity_period_days', e.target.value)}
                                            className="w-full pr-10 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                            placeholder="例: 90"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">日</span>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">空欄の場合は無期限となります。</p>
                                    {errors.validity_period_days && <div className="mt-1 text-sm text-red-600">{errors.validity_period_days}</div>}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h4 className="text-sm font-bold text-gray-900 mb-4">必須条件設定</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* 必須スタッフロール */}
                                    <div>
                                        <label htmlFor="required_role" className="block text-sm font-medium text-gray-700 mb-1">
                                            必須スタッフロール
                                        </label>
                                        <select
                                            id="required_role"
                                            value={data.required_role}
                                            onChange={(e) => setData('required_role', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        >
                                            <option value="">指定なし</option>
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* 必須部屋タイプ */}
                                    <div>
                                        <label htmlFor="required_room_type" className="block text-sm font-medium text-gray-700 mb-1">
                                            必須部屋タイプ
                                        </label>
                                        <select
                                            id="required_room_type"
                                            value={data.required_room_type}
                                            onChange={(e) => setData('required_room_type', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        >
                                            <option value="">指定なし</option>
                                            {roomTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* 必須機械 */}
                                    <div>
                                        <label htmlFor="required_machine_id" className="block text-sm font-medium text-gray-700 mb-1">
                                            必須機械名
                                        </label>
                                        <select
                                            id="required_machine_id"
                                            value={data.required_machine_id}
                                            onChange={(e) => setData('required_machine_id', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                        >
                                            <option value="">指定なし</option>
                                            {machines.map((machine) => (
                                                <option key={machine.id} value={machine.id}>
                                                    {machine.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <label className="block text-sm font-bold text-gray-900 mb-4">
                                    関連商品 (オプション/物販)
                                </label>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    {products && products.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {products.map((product) => (
                                                <label key={product.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                                                    <div className="flex items-center h-5">
                                                        <input
                                                            type="checkbox"
                                                            value={product.id}
                                                            checked={data.product_ids.includes(product.id)}
                                                            onChange={handleProductChange}
                                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                                        <span className="text-xs text-gray-500">¥{product.price.toLocaleString()}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">登録されている商品がありません。</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                            <Link
                                href={route('staff.menus.index')}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                キャンセル
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:border-primary-900 focus:ring ring-primary-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm"
                            >
                                {processing ? '保存中...' : '保存する'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}