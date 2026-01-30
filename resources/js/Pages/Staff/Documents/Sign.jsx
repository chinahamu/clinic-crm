import React, { useState, useRef } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

export default function Sign({ auth, patient, templates, contract }) {
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [step, setStep] = useState(contract ? 1 : 3);
    const [loading, setLoading] = useState(false);

    // Consent Checks
    const [checks, setChecks] = useState({
        overview: false,
        cooling_off: false,
    });

    const sigCanvas = useRef({});

    const { data, setData, post, processing, errors } = useForm({
        document_template_id: '',
        signature_image: '',
        signed_content: '',
        contract_id: contract ? contract.id : '',
    });

    const handleTemplateChange = (e) => {
        const templateId = e.target.value;
        setSelectedTemplateId(templateId);
        const template = templates.find(t => t.id == templateId);

        setData(prev => ({
            ...prev,
            document_template_id: templateId,
            signed_content: template ? template.content : '',
            signature_image: '',
        }));

        if (sigCanvas.current && sigCanvas.current.clear) {
            sigCanvas.current.clear();
        }
    };

    const clearSignature = () => {
        sigCanvas.current.clear();
        setData('signature_image', '');
    };

    const handleOverviewConfirm = async () => {
        if (!contract) return;
        setLoading(true);
        try {
            await axios.post(route('staff.contracts.markOverviewDelivered', contract.id));
            setStep(2);
        } catch (error) {
            console.error(error);
            alert('概要書面の確認記録に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        if (sigCanvas.current.isEmpty()) {
            alert('署名してください。');
            return;
        }

        post(route('staff.documents.storeSignature', patient.id));
    };

    const isStep2Valid = checks.overview && checks.cooling_off;

    return (
        <StaffLayout
            user={auth.user}
            header="電子署名"
        >
            <Head title="電子署名" />

            <div className="max-w-4xl mx-auto">
                {contract && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between relative px-10">
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>

                            <div className={`flex flex-col items-center bg-white px-4 z-10 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-white'} font-bold mb-1 transition-colors duration-300`}>1</div>
                                <span className="text-xs font-semibold">概要書面</span>
                            </div>

                            <div className={`flex flex-col items-center bg-white px-4 z-10 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-white'} font-bold mb-1 transition-colors duration-300`}>2</div>
                                <span className="text-xs font-semibold">同意・確認</span>
                            </div>

                            <div className={`flex flex-col items-center bg-white px-4 z-10 ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-white'} font-bold mb-1 transition-colors duration-300`}>3</div>
                                <span className="text-xs font-semibold">署名</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            {step === 1 ? '概要書面の交付・確認' : step === 2 ? '同意事項の確認' : '電子署名の作成'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            患者様: <span className="font-medium text-gray-900">{patient.name} 様</span>
                        </p>
                    </div>

                    <div className="p-6">
                        {step === 1 && contract && (
                            <div className="space-y-6 text-center py-8 animate-fade-in">
                                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">概要書面（重要事項説明書）の交付</h4>
                                <p className="text-gray-600 max-w-md mx-auto mb-6">
                                    契約締結前に、必ず概要書面の内容を確認し、患者様への説明を行ってください。<br />
                                    「確認」ボタンを押すと交付日時がシステムに記録されます。
                                </p>

                                <button
                                    onClick={handleOverviewConfirm}
                                    disabled={loading}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md disabled:opacity-50"
                                >
                                    {loading ? '処理中...' : '概要書面を確認・交付済みにする'}
                                </button>
                            </div>
                        )}

                        {step === 2 && contract && (
                            <div className="space-y-6 animate-fade-in max-w-3xl mx-auto py-4">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">重要確認事項</h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>以下の項目について、患者様への説明と同意確認を行ってください。</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-start p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors block border-l-4 border-l-transparent hover:border-l-primary-500">
                                        <input
                                            type="checkbox"
                                            className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            checked={checks.overview}
                                            onChange={e => setChecks({ ...checks, overview: e.target.checked })}
                                        />
                                        <span className="ml-3 text-gray-700 font-medium select-none">
                                            私（患者）は、概要書面の内容について十分な説明を受け、その内容を理解しました。
                                        </span>
                                    </label>

                                    <label className="flex items-start p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors block border-l-4 border-l-transparent hover:border-l-primary-500">
                                        <input
                                            type="checkbox"
                                            className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                            checked={checks.cooling_off}
                                            onChange={e => setChecks({ ...checks, cooling_off: e.target.checked })}
                                        />
                                        <span className="ml-3 text-gray-700 font-medium select-none">
                                            特定商取引法に基づくクーリング・オフ制度（契約解除）についての説明を受け、内容を理解しました。
                                        </span>
                                    </label>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={!isStep2Valid}
                                        className="inline-flex items-center px-6 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        次へ進む
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-fade-in">
                                {/* テンプレート選択 */}
                                <div>
                                    <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
                                        書類テンプレート選択 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="template"
                                        value={selectedTemplateId}
                                        onChange={handleTemplateChange}
                                        className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 shadow-sm transition-colors"
                                    >
                                        <option value="">選択してください</option>
                                        {templates.map((template) => (
                                            <option key={template.id} value={template.id}>
                                                {template.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.document_template_id && <div className="mt-1 text-sm text-red-600">{errors.document_template_id}</div>}
                                </div>

                                {selectedTemplateId && (
                                    <>
                                        {/* 書類内容プレビュー */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                書類内容確認
                                            </label>
                                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                                                {data.signed_content}
                                            </div>
                                        </div>

                                        {/* 署名エリア */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                署名 <span className="text-red-500">*</span>
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 inline-block overflow-hidden">
                                                <SignatureCanvas
                                                    penColor="black"
                                                    canvasProps={{
                                                        width: 500,
                                                        height: 200,
                                                        className: 'cursor-crosshair bg-white'
                                                    }}
                                                    ref={sigCanvas}
                                                    onEnd={() => {
                                                        setData('signature_image', sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-2 flex justify-start">
                                                <button
                                                    type="button"
                                                    onClick={clearSignature}
                                                    className="text-sm text-gray-500 hover:text-red-600 underline transition-colors"
                                                >
                                                    署名をクリア
                                                </button>
                                            </div>
                                            {errors.signature_image && <div className="mt-1 text-sm text-red-600">{errors.signature_image}</div>}
                                        </div>

                                        {/* アクションボタン */}
                                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                                            <Link
                                                href={route('staff.patients.show', patient.id)}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                            >
                                                キャンセル
                                            </Link>
                                            <button
                                                onClick={submit}
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 active:bg-primary-900 focus:outline-none focus:border-primary-900 focus:ring ring-primary-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-sm"
                                            >
                                                {processing ? '保存中...' : '署名を保存'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
