import React from 'react';
import { Head, Link } from '@inertiajs/react';

const FeatureDetailSection = ({ title, description, imageSrc, reverse = false, details = [] }) => (
    <div className="py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col lg:flex-row items-start gap-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text Content */}
                <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        {description}
                    </p>

                    <div className="space-y-6">
                        {details.map((detail, index) => (
                            <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                                    <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    {detail.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {detail.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Content */}
                <div className="flex-1 w-full sticky top-24">
                    <div className="relative bg-white rounded-2xl shadow-2xl shadow-indigo-500/10 p-2 border border-slate-100">
                        <img src={imageSrc} alt={title} className="w-full h-auto rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function FeatureDetail() {
    return (
        <>
            <Head title="機能詳細 - Clinic CRM" />
            <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">

                {/* Navbar (Simplified) */}
                <nav className="bg-white/90 backdrop-blur-md shadow-sm py-4 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <Link href="/" className="flex items-center gap-2 cursor-pointer">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <span className="text-white font-bold text-xl">C</span>
                                </div>
                                <span className="font-bold text-2xl tracking-tight text-slate-900">Clinic<span className="text-indigo-600">CRM</span></span>
                            </Link>
                            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                トップへ戻る
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Header */}
                <div className="bg-slate-50 py-20 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                            機能詳細
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-600">
                            Clinic CRMが提供する、クリニック運営を革新する機能の数々をご紹介します。
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="divide-y divide-slate-100">
                    <FeatureDetailSection
                        title="AI搭載スマート予約管理"
                        description="従来の予約システムでは難しかった、複雑な条件（スタッフ、部屋、機器）を考慮した予約最適化をAIが自動で行います。"
                        imageSrc="/img/reservation.png"
                        details={[
                            {
                                title: "自動最適化アルゴリズム",
                                description: "スタッフのシフト、処置室の空き状況、必要な医療機器の稼働状況をリアルタイムで分析し、最適な予約枠を提案します。"
                            },
                            {
                                title: "ダブルブッキング防止",
                                description: "システムが常にリソースの整合性をチェックしているため、人的ミスによるダブルブッキングを完全に防ぎます。"
                            },
                            {
                                title: "柔軟な設定変更",
                                description: "急なスタッフの欠勤や機器の故障など、突発的な事態にも即座に対応し、予約枠を再計算します。"
                            }
                        ]}
                    />

                    <FeatureDetailSection
                        reverse
                        title="患者マイページ"
                        description="患者様自身のスマートフォンから、いつでもどこでも予約や確認ができる専用ポータルを提供します。"
                        imageSrc="/img/patientdashboard.png"
                        details={[
                            {
                                title: "24時間365日予約受付",
                                description: "診療時間外でも予約の受付・変更・キャンセルが可能。機会損失を防ぎ、患者様の利便性を向上させます。"
                            },
                            {
                                title: "予約履歴・施術履歴の確認",
                                description: "過去の予約や施術内容をいつでも確認できるため、患者様自身の健康管理意識の向上にもつながります。"
                            },
                            {
                                title: "お知らせ配信",
                                description: "クリニックからのお知らせや、予約のリマインド通知を配信し、来院忘れを防止します。"
                            }
                        ]}
                    />

                    <FeatureDetailSection
                        title="スタッフ管理・分析"
                        description="スタッフのシフト管理からパフォーマンス分析まで、組織運営に必要な機能を網羅しています。"
                        imageSrc="/img/staffschedule.png"
                        details={[
                            {
                                title: "スキルベースのシフト管理",
                                description: "スタッフごとの保有資格やスキルセットに基づいたシフト作成が可能。適切な人員配置をサポートします。"
                            },
                            {
                                title: "業務負荷の可視化",
                                description: "誰がどの業務をどれくらい担当しているかを可視化し、業務の偏りを是正します。"
                            },
                            {
                                title: "パフォーマンス分析",
                                description: "施術数や指名数などのデータを分析し、スタッフの評価や育成に活用できます。"
                            }
                        ]}
                    />
                </div>

                {/* CTA */}
                <div className="bg-slate-900 py-24 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                            まずは無料デモで体験してください
                        </h2>
                        <Link href="#" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-indigo-900 bg-white hover:bg-indigo-50 shadow-xl transition-all hover:scale-105">
                            無料デモを申し込む
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-slate-50 py-12 border-t border-slate-200 text-center text-slate-500 text-sm">
                    <div className="max-w-7xl mx-auto px-4">
                        &copy; {new Date().getFullYear()} ClinicCRM. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}
