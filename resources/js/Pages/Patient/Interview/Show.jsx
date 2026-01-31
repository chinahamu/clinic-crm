import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, reservation, template }) {
    // Group questions into logical steps.
    // In a real app, we might add 'step' property to questions or logic to grouping.
    // Here we hardcode mapping for the seeded template or use simple chunking.
    // Seeder: q1(range), q2(date), q3(text).
    // Let's assume 1 question per step for the wizard as they represent different contexts.

    const questions = template.questions || [];
    const [currentStep, setCurrentStep] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        template_id: template.id,
        answers: {},
    });

    const totalSteps = questions.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    const handleAnswerChange = (qId, value) => {
        setData('answers', {
            ...data.answers,
            [qId]: value,
        });
    };

    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('patient.interview.store', reservation.id));
    };

    // Render Question Component dispatcher
    const renderQuestion = (question) => {
        const answer = data.answers[question.id] || '';

        switch (question.type) {
            case 'range':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between text-sm font-medium text-gray-500">
                            <span>{question.options?.minLabel || 'Min'}</span>
                            <span>{question.options?.maxLabel || 'Max'}</span>
                        </div>
                        <input
                            type="range"
                            min={question.options?.min || 1}
                            max={question.options?.max || 5}
                            value={answer || Math.ceil((question.options?.max || 5) / 2)}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-center font-bold text-2xl text-blue-600">
                            {answer || Math.ceil((question.options?.max || 5) / 2)}
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            スライダーを動かして回答してください
                        </p>
                    </div>
                );
            case 'date':
                return (
                    <div className="space-y-4">
                        <input
                            type="date"
                            value={answer}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {/* 
                           Note: If we want to capture "Event Title" separately for the 'date', 
                           we'd need a sub-field or a separate question. 
                           Based on implementation plan, we stick to the configured question type.
                        */}
                    </div>
                );
            case 'text':
                return (
                    <div className="space-y-2">
                        <textarea
                            value={answer}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="自由にご記入ください..."
                        />
                    </div>
                );
            default:
                return (
                    <div className="text-red-500">Unknown question type: {question.type}</div>
                );
        }
    };

    const currentQuestion = questions[currentStep];

    return (
        <AuthenticatedLayout user={auth.user} header="事前問診">
            <Head title="事前問診" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            <span>Step {currentStep + 1}/{totalSteps}</span>
                            <span>{Math.round(progress)}% Completed</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
                        {/* Form Body */}
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Q{currentStep + 1}. {currentQuestion?.label}
                            </h2>

                            <div className="min-h-[200px]">
                                {currentQuestion && renderQuestion(currentQuestion)}
                            </div>
                        </div>

                        {/* Footer / Navigation */}
                        <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-100">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStep === 0
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                            >
                                前へ
                            </button>

                            {currentStep === totalSteps - 1 ? (
                                <button
                                    onClick={submit}
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transform transition hover:-translate-y-0.5"
                                >
                                    {processing ? '送信中...' : '完了・送信'}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-bold shadow-md transition-colors"
                                >
                                    次へ
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
