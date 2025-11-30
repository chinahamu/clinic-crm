import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create({ auth, products, roomTypes, machines, roles, medicines, consumables }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        duration_minutes: '',
        required_role: '',
        required_room_type: '',
        required_machine_id: '',
        num_tickets: 1,
        validity_period_days: '',
        campaign_flag: false,
        publish_start_at: '',
        publish_end_at: '',
        product_ids: [],
        items: [],
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

    const roleMap = {
        'owner': 'オーナー',
        'admin': '管理者',
        'manager': 'マネージャー',
        'doctor': '医師',
        'reception': '受付',
        'nurse': '看護師',
        'staff': 'スタッフ',
        'counselor': 'カウンセラー',
        'hq': '本部',
    };

    const roomTypeMap = {
        'consultation': '診察室',
        'treatment': '処置室',
        'counseling': 'カウンセリングルーム',
        'operating': '手術室',
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
                                <h4 className="text-sm font-bold text-gray-900 mb-4">キャンペーン設定</h4>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex items-center">
                                        <input
                                            id="campaign_flag"
                                            type="checkbox"
                                            checked={data.campaign_flag}
                                            onChange={(e) => setData('campaign_flag', e.target.checked)}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                                        />
                                        <label htmlFor="campaign_flag" className="ml-2 block text-sm text-gray-900">
                                            キャンペーン対象にする
                                        </label>
                                    </div>

                                    {data.campaign_flag && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="publish_start_at" className="block text-sm font-medium text-gray-700 mb-1">
                                                    掲載開始日時
                                                </label>
                                                <input
                                                    id="publish_start_at"
                                                    type="datetime-local"
                                                    value={data.publish_start_at}
                                                    onChange={(e) => setData('publish_start_at', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                                />
                                                {errors.publish_start_at && <div className="mt-1 text-sm text-red-600">{errors.publish_start_at}</div>}
                                            </div>

                                            <div>
                                                <label htmlFor="publish_end_at" className="block text-sm font-medium text-gray-700 mb-1">
                                                    掲載終了日時
                                                </label>
                                                <input
                                                    id="publish_end_at"
                                                    type="datetime-local"
                                                    value={data.publish_end_at}
                                                    onChange={(e) => setData('publish_end_at', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                                />
                                                {errors.publish_end_at && <div className="mt-1 text-sm text-red-600">{errors.publish_end_at}</div>}
                                            </div>
                                        </div>
                                    )}
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
                                                    {roleMap[role] || role}
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
                                                    {roomTypeMap[type] || type}
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

                            <div className="border-t border-gray-100 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-sm font-bold text-gray-900">
                                        使用薬剤・消耗品
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setData('items', [...data.items, { id: '', type: 'medicine', quantity: 1 }])}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        追加する
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <select
                                                        value={item.type}
                                                        onChange={(e) => {
                                                            const newItems = [...data.items];
                                                            newItems[index].type = e.target.value;
                                                            newItems[index].id = ''; // Reset item selection on type change
                                                            setData('items', newItems);
                                                        }}
                                                        className="w-full rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
                                                    >
                                                        <option value="medicine">薬剤</option>
                                                        <option value="consumable">消耗品</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <select
                                                        value={item.id}
                                                        onChange={(e) => {
                                                            const newItems = [...data.items];
                                                            newItems[index].id = e.target.value;
                                                            setData('items', newItems);
                                                        }}
                                                        className="w-full rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
                                                        required
                                                    >
                                                        <option value="">選択してください</option>
                                                        {(item.type === 'medicine' ? medicines : consumables).map((option) => (
                                                            <option key={option.id} value={option.id}>
                                                                {option.name} ({option.unit})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const newItems = [...data.items];
                                                            newItems[index].quantity = parseInt(e.target.value) || 1;
                                                            setData('items', newItems);
                                                        }}
                                                        className="w-full rounded-lg border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
                                                        placeholder="数量"
                                                        required
                                                    />
                                                    <span className="text-sm text-gray-500 whitespace-nowrap">
                                                        {item.id && (item.type === 'medicine' ? medicines : consumables).find(i => i.id == item.id)?.unit}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newItems = data.items.filter((_, i) => i !== index);
                                                    setData('items', newItems);
                                                }}
                                                className="text-gray-400 hover:text-red-500 p-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    {data.items.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                            使用する薬剤・消耗品を追加してください
                                        </p>
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