import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Edit({ auth, template }) {
    const { data, setData, put, post, processing, errors } = useForm({
        name: template.name || '',
        questions: template.questions || [],
    });

    const isNew = !template.id;

    const addQuestion = () => {
        const newId = `q${Date.now()}`;
        setData('questions', [
            ...data.questions,
            {
                id: newId,
                type: 'text',
                label: '新しい質問',
                options: {},
                narrative_mapping: {},
            },
        ]);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...data.questions];
        newQuestions[index][field] = value;
        setData('questions', newQuestions);
    };

    const updateNestedQuestion = (index, parentInfo, childField, value) => {
        const newQuestions = [...data.questions];
        if (!newQuestions[index][parentInfo]) {
            newQuestions[index][parentInfo] = {};
        }
        newQuestions[index][parentInfo][childField] = value;
        setData('questions', newQuestions);
    };

    const removeQuestion = (index) => {
        const newQuestions = data.questions.filter((_, i) => i !== index);
        setData('questions', newQuestions);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isNew) {
            post(route('staff.settings.interviews.store'));
        } else {
            put(route('staff.settings.interviews.update', template.id));
        }
    };

    return (
        <StaffLayout user={auth.user} header={isNew ? 'インタビューテンプレート作成' : 'インタビューテンプレート編集'}>
            <Head title="テンプレート編集" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                        <div className="p-8 space-y-8">
                            {/* Basic Info */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">テンプレート名</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="例: 初診前カウンセリングシート"
                                />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                            <hr className="border-gray-100" />

                            {/* Questions Builder */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center justify-between">
                                    質問リスト
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        + 質問を追加
                                    </button>
                                </h3>

                                {data.questions.map((q, index) => (
                                    <div key={q.id || index} className="p-6 bg-gray-50 rounded-xl border border-gray-200 relative group transition-all hover:border-blue-200 hover:shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>

                                        <div className="grid grid-cols-12 gap-6">
                                            {/* ID & Type */}
                                            <div className="col-span-3 space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1">質問ID</label>
                                                    <input
                                                        type="text"
                                                        value={q.id}
                                                        readOnly
                                                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-gray-500 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1">タイプ</label>
                                                    <select
                                                        value={q.type}
                                                        onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="text">テキスト入力</option>
                                                        <option value="range">スライダー(1-5)</option>
                                                        <option value="date">日付選択</option>
                                                        <option value="radio">選択肢(Radio)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Label & Details */}
                                            <div className="col-span-9 space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 mb-1">質問文</label>
                                                    <input
                                                        type="text"
                                                        value={q.label}
                                                        onChange={(e) => updateQuestion(index, 'label', e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="質問文を入力..."
                                                    />
                                                </div>

                                                {/* Type Specific Options */}
                                                {q.type === 'range' && (
                                                    <div className="flex gap-4 p-3 bg-white rounded border border-gray-200">
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-bold text-gray-400 mb-1">Min Label</label>
                                                            <input
                                                                type="text"
                                                                value={q.options?.minLabel || ''}
                                                                onChange={(e) => updateNestedQuestion(index, 'options', 'minLabel', e.target.value)}
                                                                className="w-full px-2 py-1 border text-sm rounded"
                                                                placeholder="安さ"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-bold text-gray-400 mb-1">Max Label</label>
                                                            <input
                                                                type="text"
                                                                value={q.options?.maxLabel || ''}
                                                                onChange={(e) => updateNestedQuestion(index, 'options', 'maxLabel', e.target.value)}
                                                                className="w-full px-2 py-1 border text-sm rounded"
                                                                placeholder="品質"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Narrative Mapping Accordion */}
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <details className="group">
                                                        <summary className="flex items-center text-sm font-bold text-gray-600 cursor-pointer hover:text-blue-600">
                                                            <svg className="w-4 h-4 mr-2 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                            ナラティブ・プロファイル連携設定
                                                        </summary>
                                                        <div className="mt-3 pl-6 space-y-3 bg-blue-50/50 p-4 rounded-lg">
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-500 mb-1">連携先モデル</label>
                                                                <select
                                                                    value={q.narrative_mapping?.target || ''}
                                                                    onChange={(e) => updateNestedQuestion(index, 'narrative_mapping', 'target', e.target.value)}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                                >
                                                                    <option value="">-- 連動しない --</option>
                                                                    <option value="patient_value">価値観 (PatientValue)</option>
                                                                    <option value="life_event">ライフイベント (LifeEvent)</option>
                                                                    <option value="narrative_log">語りログ (NarrativeLog)</option>
                                                                </select>
                                                            </div>

                                                            {q.narrative_mapping?.target === 'patient_value' && (
                                                                <div>
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1">属性キー (attribute_name)</label>
                                                                    <input
                                                                        type="text"
                                                                        value={q.narrative_mapping?.attribute || ''}
                                                                        onChange={(e) => updateNestedQuestion(index, 'narrative_mapping', 'attribute', e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                                        placeholder="例: cost_vs_quality"
                                                                    />
                                                                </div>
                                                            )}

                                                            {q.narrative_mapping?.target === 'life_event' && (
                                                                <div>
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1">イベント名 (固定)</label>
                                                                    <input
                                                                        type="text"
                                                                        value={q.narrative_mapping?.title_fixed || ''}
                                                                        onChange={(e) => updateNestedQuestion(index, 'narrative_mapping', 'title_fixed', e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                                                        placeholder="例: 結婚式"
                                                                    />
                                                                    <p className="text-xs text-gray-400 mt-1">※ 日付質問の場合に使用されます</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </details>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
                            >
                                {processing ? '保存中...' : 'テンプレートを保存'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}
