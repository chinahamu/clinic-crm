import React, { useState, useEffect } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm, Link } from '@inertiajs/react'; // Link was missing
import ContractPreview from './Preview';

export default function Create({ auth, patient, menus, products, staff, clinic }) {
    const [step, setStep] = useState('input'); // input, preview

    const { data, setData, post, processing, errors } = useForm({
        menu_id: '',
        contract_date: new Date().toISOString().split('T')[0],
        total_count: 0,
        total_price: 0,
        discount_amount: 0,
        campaign_name: '',
        expiration_date: '',
        notes: '',

        products: [], // { product_id, quantity, amount }
        payments: [{ payment_method: 'cash', amount: 0 }],

        outline_signature: '',
        contract_signature: '',
    });

    const calculateTotal = () => {
        // Calculate based on menu price * count (if applicable) or manual?
        // Usually menu has a price.
        // Let's assume manual override or automatic calculation.
        // For now, let's keep it manual but populated from menu selection.
    };

    const handleMenuChange = (e) => {
        const menuId = e.target.value;
        const menu = menus.find(m => m.id == menuId);

        if (menu) {
            setData(prev => ({
                ...prev,
                menu_id: menuId,
                total_price: menu.price,
                total_count: menu.num_tickets || 1, // Default to 1 if not set
                expiration_date: calculateExpirationDate(menu.validity_period_days),
                payments: [{ payment_method: 'cash', amount: menu.price }] // Reset payments to full amount
            }));
        } else {
            setData(prev => ({ ...prev, menu_id: menuId }));
        }
    };

    const calculateExpirationDate = (days) => {
        if (!days) return '';
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    const addProduct = () => {
        setData('products', [...data.products, { product_id: '', quantity: 1, amount: 0, name: '', type: '' }]);
    };

    const removeProduct = (index) => {
        const newProducts = [...data.products];
        newProducts.splice(index, 1);
        setData('products', newProducts);
    };

    const updateProduct = (index, field, value) => {
        const newProducts = [...data.products];
        newProducts[index][field] = value;

        if (field === 'product_id') {
            const product = products.find(p => p.id == value);
            if (product) {
                newProducts[index]['amount'] = product.price * newProducts[index].quantity;
                newProducts[index]['name'] = product.name;
                newProducts[index]['type'] = product.type; // Assuming type exists
            }
        }
        if (field === 'quantity') {
            const product = products.find(p => p.id == newProducts[index].product_id);
            if (product) {
                newProducts[index]['amount'] = product.price * value;
            }
        }

        setData('products', newProducts);
    };

    // Auto-calculate total payment to match total price + products - discount
    const grandTotal = (parseInt(data.total_price) || 0) +
        data.products.reduce((acc, p) => acc + (parseInt(p.amount) || 0), 0) -
        (parseInt(data.discount_amount) || 0);

    const addPayment = () => {
        setData('payments', [...data.payments, { payment_method: 'cash', amount: 0 }]);
    };

    const removePayment = (index) => {
        const newPayments = [...data.payments];
        newPayments.splice(index, 1);
        setData('payments', newPayments);
    };

    const updatePayment = (index, field, value) => {
        const newPayments = [...data.payments];
        newPayments[index][field] = value;
        setData('payments', newPayments);
    };

    const submit = () => {
        post(route('staff.patients.contracts.store_new', patient.id));
    };

    if (step === 'preview') {
        return (
            <ContractPreview
                data={data}
                setData={setData}
                patient={patient}
                currStaff={staff}
                clinic={clinic}
                onBack={() => setStep('input')}
                onSubmit={submit}
                processing={processing}
                menu={menus.find(m => m.id == data.menu_id)}
                grandTotal={grandTotal}
            />
        );
    }

    return (
        <StaffLayout user={auth.user} header="契約作成">
            <Head title="契約作成" />

            <div className="max-w-4xl mx-auto py-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-bold mb-4">契約内容入力</h2>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">メニュー</label>
                            <select
                                value={data.menu_id}
                                onChange={handleMenuChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">選択してください</option>
                                {menus.map(menu => (
                                    <option key={menu.id} value={menu.id}>{menu.name}</option>
                                ))}
                            </select>
                            {errors.menu_id && <div className="text-red-500 text-sm">{errors.menu_id}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">契約日</label>
                            <input
                                type="date"
                                value={data.contract_date}
                                onChange={e => setData('contract_date', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">役務回数</label>
                            <input
                                type="number"
                                value={data.total_count}
                                onChange={e => setData('total_count', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">金額 (税込)</label>
                            <input
                                type="number"
                                value={data.total_price}
                                onChange={e => setData('total_price', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">有効期限</label>
                            <input
                                type="date"
                                value={data.expiration_date}
                                onChange={e => setData('expiration_date', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">キャンペーン名</label>
                            <input
                                type="text"
                                value={data.campaign_name}
                                onChange={e => setData('campaign_name', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">割引額</label>
                            <input
                                type="number"
                                value={data.discount_amount}
                                onChange={e => setData('discount_amount', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">関連商品</h3>
                            <button type="button" onClick={addProduct} className="text-sm text-indigo-600 hover:text-indigo-900">+ 追加</button>
                        </div>
                        {data.products.map((item, index) => (
                            <div key={index} className="flex gap-4 mb-2 items-end">
                                <div className="flex-grow">
                                    <label className="text-xs text-gray-500">商品</label>
                                    <select
                                        value={item.product_id}
                                        onChange={e => updateProduct(index, 'product_id', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                    >
                                        <option value="">選択</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-20">
                                    <label className="text-xs text-gray-500">数量</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={e => updateProduct(index, 'quantity', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs text-gray-500">金額</label>
                                    <input
                                        type="number"
                                        value={item.amount}
                                        readOnly
                                        className="block w-full rounded-md border-gray-100 bg-gray-50 shadow-sm text-sm"
                                    />
                                </div>
                                <button type="button" onClick={() => removeProduct(index)} className="text-red-500">×</button>
                            </div>
                        ))}
                    </div>

                    {/* Payments */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">支払方法</h3>
                            <button type="button" onClick={addPayment} className="text-sm text-indigo-600 hover:text-indigo-900">+ 追加</button>
                        </div>
                        {data.payments.map((payment, index) => (
                            <div key={index} className="flex gap-4 mb-2 items-end">
                                <div className="flex-grow">
                                    <label className="text-xs text-gray-500">方法</label>
                                    <select
                                        value={payment.payment_method}
                                        onChange={e => updatePayment(index, 'payment_method', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                    >
                                        <option value="cash">現金</option>
                                        <option value="credit">クレジットカード</option>
                                        <option value="loan">医療ローン</option>
                                        <option value="transfer">振込</option>
                                        <option value="electronic">電子マネー</option>
                                    </select>
                                </div>
                                <div className="w-40">
                                    <label className="text-xs text-gray-500">金額</label>
                                    <input
                                        type="number"
                                        value={payment.amount}
                                        onChange={e => updatePayment(index, 'amount', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                    />
                                </div>
                                <button type="button" onClick={() => removePayment(index)} className="text-red-500">×</button>
                            </div>
                        ))}
                        <div className="text-right font-bold mt-2">
                            合計支払: {data.payments.reduce((acc, p) => acc + (parseInt(p.amount) || 0), 0).toLocaleString()} 円
                            (請求総額: {grandTotal.toLocaleString()} 円)
                        </div>
                        {errors.payments && <div className="text-red-500 text-sm text-right">{errors.payments}</div>}
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <Link
                            href={route('staff.patients.show', patient.id)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            キャンセル
                        </Link>
                        <button
                            onClick={() => setStep('preview')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            プレビュー・署名へ
                        </button>
                    </div>

                </div>
            </div>
        </StaffLayout>
    );
}
