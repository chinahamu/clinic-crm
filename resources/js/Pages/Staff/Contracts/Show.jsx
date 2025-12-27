import React from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, patient, contract, clinic, staff }) {

    // Helper to format currency
    const formatCurrency = (amount) => {
        return parseInt(amount || 0).toLocaleString() + '円';
    };

    // Helper to format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    };

    // Find signed documents
    const outlineDoc = contract.signed_documents?.find(d => d.document_template?.title === '概要書面');
    const contractDoc = contract.signed_documents?.find(d => d.document_template?.title === '契約書');

    const outlineSignature = outlineDoc ? `/storage/${outlineDoc.signature_image_path}` : null;
    const contractSignature = contractDoc ? `/storage/${contractDoc.signature_image_path}` : null;

    const grandTotal = (parseInt(contract.total_price) || 0) +
        contract.products.reduce((acc, p) => acc + (parseInt(p.amount) || 0), 0) -
        (parseInt(contract.discount_amount) || 0);

    return (
        <StaffLayout user={auth.user} header="契約詳細">
            <Head title="契約詳細" />

            <div className="max-w-5xl mx-auto py-6 space-y-8">

                {/* Print/Back Actions */}
                <div className="flex justify-between items-center print:hidden">
                    <Link href={route('staff.patients.show', patient.id)} className="text-indigo-600 hover:text-indigo-900">
                        &larr; 患者詳細に戻る
                    </Link>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                        印刷する
                    </button>
                </div>

                {/* 1. 概要書面 (Outline Document) */}
                <div className="bg-white shadow-lg p-8 text-xs leading-relaxed print:shadow-none print:w-full print:break-after-page">
                    <h1 className="text-xl font-bold text-center mb-6">美容医療施術提供 概要書面</h1>

                    <div className="flex border border-black mb-4">
                        <div className="bg-gray-100 p-1 w-24 border-r border-black font-bold flex items-center justify-center">御氏名</div>
                        <div className="p-1 flex-grow font-bold text-lg">{patient.name} 様</div>
                    </div>

                    <div className="mb-2 font-bold">1. 施術(美容医療)提供メニューについて</div>
                    <p className="mb-4 text-xs">施術名・時間・料金等の詳しい内容は当院の料金表をご覧ください。</p>

                    <div className="mb-2 font-bold">2. ご希望の役務内容と概算額</div>
                    <div className="mb-1">(1) 役務提供</div>
                    <table className="w-full border-collapse border border-black mb-4 text-center">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-1">施術名</th>
                                <th className="border border-black p-1">役務提供期間</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black p-1">{contract.total_count}回 : {contract.menu?.name}</td>
                                <td className="border border-black p-1">{formatDate(contract.contract_date)} 〜 {formatDate(contract.expiration_date)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mb-1">(2) 役務の内容</div>
                    <table className="w-full border-collapse border border-black mb-4 text-center text-xs">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-1">運用キャンペーン</th>
                                <th className="border border-black p-1">施術名</th>
                                <th className="border border-black p-1">時間</th>
                                <th className="border border-black p-1">単価</th>
                                <th className="border border-black p-1">回数</th>
                                <th className="border border-black p-1">数量</th>
                                <th className="border border-black p-1">総時間数</th>
                                <th className="border border-black p-1">金額(消費税含む)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black p-1">{contract.campaign_name || '-'}</td>
                                <td className="border border-black p-1">{contract.total_count}回 : {contract.menu?.name}</td>
                                <td className="border border-black p-1">{contract.menu?.duration_minutes}分</td>
                                <td className="border border-black p-1">{formatCurrency(contract.total_price)}</td>
                                <td className="border border-black p-1">{contract.total_count}</td>
                                <td className="border border-black p-1">1</td>
                                <td className="border border-black p-1">{(contract.menu?.duration_minutes * contract.total_count / 60).toFixed(1)}時間</td>
                                <td className="border border-black p-1">{formatCurrency(contract.total_price)}</td>
                            </tr>
                            <tr>
                                <td colSpan="7" className="border border-black p-1 text-right bg-gray-50">割引</td>
                                <td className="border border-black p-1">{formatCurrency(contract.discount_amount)}</td>
                            </tr>
                            <tr>
                                <td colSpan="7" className="border border-black p-1 text-right bg-gray-50">合計①</td>
                                <td className="border border-black p-1">{formatCurrency(parseInt(contract.total_price) - parseInt(contract.discount_amount))}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mb-1">(3) 関連商品</div>
                    <table className="w-full border-collapse border border-black mb-4 text-center">
                        <thead>
                            <tr className="border border-black">
                                <th className="border border-black p-1 w-1/2">商品名</th>
                                <th className="border border-black p-1">単価</th>
                                <th className="border border-black p-1">数量</th>
                                <th className="border border-black p-1">金額(消費税含む)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contract.products.map((p, i) => (
                                <tr key={i}>
                                    <td className="border border-black p-1 text-left">{p.product?.name}</td>
                                    <td className="border border-black p-1">{formatCurrency(p.amount / p.quantity)}</td>
                                    <td className="border border-black p-1">{p.quantity}</td>
                                    <td className="border border-black p-1">{formatCurrency(p.amount)}</td>
                                </tr>
                            ))}
                            {contract.products.length === 0 && <tr><td colSpan="4" className="border border-black p-1 py-4 text-gray-300">なし</td></tr>}
                            <tr>
                                <td colSpan="3" className="border border-black p-1 text-right bg-gray-50">合計②</td>
                                <td className="border border-black p-1">{formatCurrency(contract.products.reduce((acc, p) => acc + parseInt(p.amount), 0))}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="border border-black p-1 text-right bg-gray-100 font-bold">総合計金額①+②</td>
                                <td className="border border-black p-1 font-bold">{formatCurrency(grandTotal)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mb-1">お支払方法及びお支払時期</div>
                    <table className="w-full border-collapse border border-black mb-4 text-center">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-1">ご利用チェック</th>
                                <th className="border border-black p-1">支払種別</th>
                                <th className="border border-black p-1">支払時期</th>
                                <th className="border border-black p-1">支払金額</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contract.payments.map((pay, i) => (
                                <tr key={i}>
                                    <td className="border border-black p-1">✓</td>
                                    <td className="border border-black p-1">{pay.payment_method}</td>
                                    <td className="border border-black p-1">{formatDate(contract.contract_date)}</td>
                                    <td className="border border-black p-1">{formatCurrency(pay.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex border border-black">
                        <div className="w-1/2 p-2 border-r border-black">
                            <div className="text-center font-bold mb-2">支払合計金額<br />(分割手数料及び消費税込)</div>
                            <div className="text-right text-xl font-bold mt-4">{formatCurrency(grandTotal)}</div>
                        </div>
                        <div className="w-1/2 p-0 flex flex-col">
                            <div className="border-b border-black p-1 bg-gray-100 text-center font-bold text-xs">概要書面受領確認</div>
                            <div className="flex-grow flex p-2 items-center justify-between">
                                <div>{formatDate(contract.contract_date)}</div>
                                <div className="w-48 h-20 flex items-center justify-center">
                                    {outlineSignature ? (
                                        <img src={outlineSignature} alt="signature" className="max-w-full max-h-full" />
                                    ) : (
                                        <span className="text-gray-400">署名なし</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 契約書 (Contract Document) */}
                <div className="bg-white shadow-lg p-8 text-xs leading-relaxed print:shadow-none print:w-full">
                    <h1 className="text-xl font-bold text-center mb-6">美容医療施術提供契約書</h1>
                    <div className="text-center mb-6">別紙の約款に基づき以下の通り契約を締結します。</div>

                    <table className="w-full border-collapse border border-black mb-4">
                        <tbody>
                            <tr>
                                <td className="border border-black p-1 bg-gray-100 w-24 text-center font-bold">契約日</td>
                                <td colSpan="3" className="border border-black p-1">{formatDate(contract.contract_date)}</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 bg-gray-100 text-center font-bold">氏名</td>
                                <td className="border border-black p-1">{patient.name}</td>
                                <td className="border border-black p-1 bg-gray-100 text-center font-bold">生年月日</td>
                                <td className="border border-black p-1">{patient.birthday}</td>
                            </tr>
                            <tr>
                                <td className="border border-black p-1 bg-gray-100 text-center font-bold">住所</td>
                                <td colSpan="3" className="border border-black p-1">{patient.address || '-'}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Reusing contract details table logic for brevity, in real app refactor to components */}
                    <div className="mb-2 font-bold">1. 〈役務提供の内容〉 ※役務1回コースは特定商取引法適応外となります。</div>
                    <table className="w-full border-collapse border border-black mb-4 text-center text-xs">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-1">運用キャンペーン</th>
                                <th className="border border-black p-1">施術名</th>
                                <th className="border border-black p-1">時間</th>
                                <th className="border border-black p-1">単価</th>
                                <th className="border border-black p-1">回数</th>
                                <th className="border border-black p-1">数量</th>
                                <th className="border border-black p-1">総時間数</th>
                                <th className="border border-black p-1">金額(消費税含む)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black p-1">{contract.campaign_name || '-'}</td>
                                <td className="border border-black p-1">{contract.total_count}回 : {contract.menu?.name}</td>
                                <td className="border border-black p-1">{contract.menu?.duration_minutes}分</td>
                                <td className="border border-black p-1">{formatCurrency(contract.total_price)}</td>
                                <td className="border border-black p-1">{contract.total_count}</td>
                                <td className="border border-black p-1">1</td>
                                <td className="border border-black p-1">{(contract.menu?.duration_minutes * contract.total_count / 60).toFixed(1)}時間</td>
                                <td className="border border-black p-1">{formatCurrency(contract.total_price)}</td>
                            </tr>
                            <tr>
                                <td colSpan="7" className="border border-black p-1 text-right bg-gray-50">割引</td>
                                <td className="border border-black p-1">{formatCurrency(contract.discount_amount)}</td>
                            </tr>
                            <tr>
                                <td colSpan="7" className="border border-black p-1 text-right bg-gray-50">合計①</td>
                                <td className="border border-black p-1">{formatCurrency(parseInt(contract.total_price) - parseInt(contract.discount_amount))}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex border border-black mt-8">
                        <div className="w-1/2 p-2 border-r border-black">
                            <div className="text-center font-bold mb-2">支払合計金額<br />(分割手数料及び消費税込)</div>
                            <div className="text-right text-xl font-bold mt-4">{formatCurrency(grandTotal)}</div>
                        </div>
                        <div className="w-1/2 p-0 flex flex-col">
                            <div className="border-b border-black p-1 bg-gray-100 text-center font-bold text-xs">施術契約書受領確認 (署名)</div>
                            <div className="flex-grow flex p-2 items-center justify-between">
                                <div>{formatDate(contract.contract_date)}</div>
                                <div className="w-48 h-20 flex items-center justify-center">
                                    {contractSignature ? (
                                        <img src={contractSignature} alt="signature" className="max-w-full max-h-full" />
                                    ) : (
                                        <span className="text-gray-400">署名なし</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </StaffLayout>
    );
}
