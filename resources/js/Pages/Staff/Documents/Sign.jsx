import React, { useState, useRef } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import SignatureCanvas from 'react-signature-canvas';

export default function Sign({ auth, patient, templates }) {
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const sigCanvas = useRef({});
    
    const { data, setData, post, processing, errors } = useForm({
        document_template_id: '',
        signature_image: '',
        signed_content: '',
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

    const submit = (e) => {
        e.preventDefault();
        
        if (sigCanvas.current.isEmpty()) {
            alert('署名してください。');
            return;
        }

        post(route('staff.documents.storeSignature', patient.id));
    };

    return (
        <StaffLayout
            user={auth.user}
            header="電子署名"
        >
            <Head title="電子署名" />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            電子署名の作成
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            患者様: <span className="font-medium text-gray-900">{patient.name} 様</span>
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
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
                            <div className="space-y-6 animate-fade-in">
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
