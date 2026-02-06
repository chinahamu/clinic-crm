import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function ShowSigned({ auth, signedDocument }) {
    // 日付を日本時間（Asia/Tokyo）で表示するヘルパー関数
    const formatJST = (value) => {
        if (!value) return '-';
        const d = new Date(value);
        return new Intl.DateTimeFormat('ja-JP', {
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(d);
    };

    return (
        <StaffLayout
            user={auth.user}
            header="同意済書類詳細"
        >
            <Head title="同意済書類詳細" />

            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        href={route('staff.patients.show', signedDocument.user_id)}
                        className="text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        患者詳細へ戻る
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {signedDocument.document_template?.title || '不明な書類'}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                患者様: {signedDocument.user?.name} 様
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">署名日時</p>
                            <p className="text-sm text-gray-500">{formatJST(signedDocument.signed_at)}</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">書類内容</h3>
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                                {signedDocument.signed_content}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">署名</h3>
                                <div className="p-4 bg-white border border-gray-200 rounded-xl inline-block shadow-sm">
                                    <img
                                        src={`/storage/${signedDocument.signature_image_path}`}
                                        alt="Signature"
                                        className="max-w-full h-auto max-h-48"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">管理情報</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">担当スタッフ</p>
                                        <p className="text-sm text-gray-700 font-medium">{signedDocument.staff?.name || '不明'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">IPアドレス</p>
                                        <p className="text-sm text-gray-700 font-medium">{signedDocument.ip_address || '-'}</p>
                                    </div>
                                    <div className="truncate">
                                        <p className="text-xs text-gray-400 font-bold uppercase">ユーザーエージェント</p>
                                        <p className="text-sm text-gray-700 font-medium truncate" title={signedDocument.user_agent}>
                                            {signedDocument.user_agent || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {signedDocument.file_path && (
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <a
                                href={route('staff.documents.downloadPdf', signedDocument.id)}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition-colors gap-2"
                            >
                                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                PDFをダウンロード
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </StaffLayout>
    );
}
