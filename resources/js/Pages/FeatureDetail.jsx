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
                        {imageSrc ? (
                            <img src={imageSrc} alt={title} className="w-full h-auto rounded-xl" />
                        ) : (
                            <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                                [スクリーンショット準備中]
                            </div>
                        )}
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
                        title="スマート予約管理"
                        description="スタッフ・部屋・機器の空き状況をリアルタイムで照合するルールエンジンが、最適な予約枠を自動で提案します。従来の手作業では難しかった複雑な条件管理を自動化します。"
                        imageSrc="/img/reservation.png"
                        details={[
                            {
                                title: "自動最適化",
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
                        description="患者様自身のスマートフォンから、いつでもどこでも予約確認ができる専用ポータルを提供します。LINEアカウントでのログインにも対応しています。"
                        imageSrc="/img/patientdashboard.png"
                        details={[
                            {
                                title: "24時間365日 予約受付",
                                description: "クリニックコード付きURLから診療時間外でも予約の受付が可能。機会損失を防ぎ、患者様の利便性を向上させます。"
                            },
                            {
                                title: "予約履歴・施術記録の確認",
                                description: "過去の予約や施術内容をいつでも確認できるため、患者様自身の健康管理意識の向上にもつながります。"
                            },
                            {
                                title: "予約完了メール通知",
                                description: "予約完了時に患者・スタッフ双方へ自動でメール通知を送信。確認漏れを防ぎます。"
                            }
                        ]}
                    />

                    <FeatureDetailSection
                        title="スタッフ管理・KPIダッシュボード"
                        description="スタッフのシフト管理から経営KPIの可視化まで、組織運営に必要な機能を網羅しています。希望シフトの収集から自動生成まで一貫して対応します。"
                        imageSrc="/img/staffschedule.png"
                        details={[
                            {
                                title: "シフト自動生成",
                                description: "スタッフの希望シフトや制約条件をもとに、システムが最適なシフトを自動生成。シフト作成にかかる管理工数を大幅に削減します。"
                            },
                            {
                                title: "KPIダッシュボード",
                                description: "来院数・売上・新規患者数などクリニック経営の主要指標をリアルタイムで可視化。データに基づいた経営判断をサポートします。"
                            },
                            {
                                title: "役割・権限管理",
                                description: "スタッフごとにクリニック内の役割（ClinicRole）を設定し、適切な情報へのアクセス権限を管理できます。"
                            }
                        ]}
                    />

                    <FeatureDetailSection
                        reverse
                        title="ナラティブCRM"
                        description="患者一人ひとりの価値観・ライフイベント・施術記録を蓄積する独自の「ナラティブプロフィール」機能。表面的な顧客データに留まらない、深い患者理解を実現します。"
                        imageSrc={null}
                        details={[
                            {
                                title: "ナラティブプロフィール",
                                description: "患者の価値観・特性（PatientValue）やライフイベントを記録・更新。患者背景を深く理解することで、より質の高いコミュニケーションが可能になります。"
                            },
                            {
                                title: "患者価値の自動計算",
                                description: "蓄積されたデータをもとに、患者価値スコアを非同期でバックグラウンド計算。重要な患者へのフォローアップ優先度付けに活用できます。"
                            },
                            {
                                title: "ナラティブログ",
                                description: "施術記録やスタッフメモをナラティブログとして蓄積。次回来院時に患者の状況を素早く把握できます。"
                            }
                        ]}
                    />

                    <FeatureDetailSection
                        title="LINE連携"
                        description="LINEアカウントでのログインから、LINE Messaging APIを活用したメッセージ・シナリオの自動配信まで、患者とのコミュニケーションをLINEで完結できます。"
                        imageSrc={null}
                        details={[
                            {
                                title: "LINEログイン（LINE OAuth）",
                                description: "患者がLINEアカウントでそのままログイン可能。新規登録の手間を省き、アカウント登録率の向上に貢献します。"
                            },
                            {
                                title: "LINEメッセージ送信",
                                description: "LINE Messaging APIを通じて、スタッフから患者へ直接LINEメッセージを送信。重要なお知らせも確実に届けられます。"
                            },
                            {
                                title: "LINEシナリオ自動配信",
                                description: "設定したステップメールシナリオをLINEでも自動配信。メールが届きにくい患者へのフォローアップに有効です。"
                            }
                        ]}
                    />

                    <FeatureDetailSection
                        reverse
                        title="Web問診・電子契約"
                        description="予約に連動したオンライン問診フォームと電子署名による同意書管理で、受付業務のペーパーレス化を実現します。"
                        imageSrc={null}
                        details={[
                            {
                                title: "Web問診フォーム",
                                description: "予約に紐づく問診フォームを事前にオンラインで収集。来院前の入力で受付時間を短縮し、スタッフの負担を軽減します。"
                            },
                            {
                                title: "電子署名・同意書管理",
                                description: "タブレットでのデジタルサインに対応。署名済みドキュメントはPDFでダウンロード可能で、紙の保管場所が不要になります。"
                            },
                            {
                                title: "問診テンプレート管理",
                                description: "Web問診のテンプレートをCRUDで自由に管理。クリニックの診療内容に合わせた問診票を柔軟に作成・変更できます。"
                            }
                        ]}
                    />

                    <FeatureDetailSection
                        title="マーケティング・ステップメール"
                        description="患者のセグメント化と自動メール配信により、休眠患者の掘り起こしやリピーター育成を仕組み化します。"
                        imageSrc={null}
                        details={[
                            {
                                title: "顧客セグメント",
                                description: "様々な条件（来院回数・最終来院日・施術種別など）で患者をセグメント化し、ターゲットを絞ったコミュニケーションを実現します。"
                            },
                            {
                                title: "ステップメール自動配信",
                                description: "メールシナリオを設定しておけば、スタッフが手動でトリガーするか、条件に基づいてフォローアップメールが自動送信されます。"
                            },
                            {
                                title: "CSVエクスポート",
                                description: "セグメントに基づいた患者リストをCSV形式でエクスポート。外部のマーケティングツールとの連携にも活用できます。"
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
                        <a href="/#contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-indigo-900 bg-white hover:bg-indigo-50 shadow-xl transition-all hover:scale-105">
                            無料デモを申し込む
                        </a>
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
