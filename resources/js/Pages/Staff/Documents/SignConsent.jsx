import React, { useRef, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';
import SignatureCanvas from 'react-signature-canvas';

export default function SignConsent({ auth, patient, templates }) {
    const sigCanvas = useRef({});
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const { data, setData, post, processing, errors, transform } = useForm({
        document_template_id: '',
        signature_data: '', // Base64形式
    });

    const handleTemplateChange = (e) => {
        const id = e.target.value;
        const template = templates.find(t => t.id == id);
        setSelectedTemplate(template);
        setData('document_template_id', id);
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (sigCanvas.current.isEmpty()) {
            alert('署名してください。');
            return;
        }

        // 送信直前にCanvasからサインを取得してFormデータに反映させる
        transform((data) => ({
            ...data,
            signature_data: sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'),
        }));

        post(route('staff.patients.documents.store', patient.id));
    };

    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    return (
        <StaffLayout
            user={auth.user}
            header="同意書作成・署名"
        >
            <Head title="同意書作成・署名" />

            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <h1 className="text-xl font-bold text-gray-900">同意書作成・署名</h1>
                        <p className="text-sm text-gray-500 mt-1">患者様: {patient.name} 様</p>
                    </div>

                    <form onSubmit={handleSave} className="p-6 space-y-8">
                        {/* テンプレート選択 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">書類テンプレート <span className="text-red-500">*</span></label>
                            <select
                                className="w-full py-3 px-4 border-gray-300 rounded-xl text-base focus:ring-primary-500 focus:border-primary-500 transition-all"
                                value={data.document_template_id}
                                onChange={handleTemplateChange}
                                required
                            >
                                <option value="">選択してください</option>
                                {templates.map(t => <option key={t.id} value={t.id}>{t.title || t.name}</option>)}
                            </select>
                            {errors.document_template_id && <p className="text-sm text-red-500">{errors.document_template_id}</p>}
                        </div>

                        {selectedTemplate && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-60 overflow-y-auto">
                                    <h3 className="text-sm font-bold text-gray-700 mb-2">書類内容</h3>
                                    <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                                        {selectedTemplate.content}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 電子サイン領域 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">署名 <span className="text-red-500">*</span></label>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-white hover:border-primary-300 transition-colors group">
                                <div className="flex justify-center bg-gray-50 rounded-xl overflow-hidden">
                                    <SignatureCanvas
                                        ref={sigCanvas}
                                        penColor="black"
                                        canvasProps={{
                                            width: 600,
                                            height: 250,
                                            className: 'cursor-crosshair w-full'
                                        }}
                                    />
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-xs text-gray-400 font-medium">※ 枠内に署名してください</p>
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        サインをクリア
                                    </button>
                                </div>
                            </div>
                            {errors.signature_data && <p className="text-sm text-red-500">{errors.signature_data}</p>}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link
                                href={route('staff.patients.show', patient.id)}
                                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl text-center hover:bg-gray-200 transition-colors"
                            >
                                キャンセル
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-[2] py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {processing ? '保存中...' : '同意して保存'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}
