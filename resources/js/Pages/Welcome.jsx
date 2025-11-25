import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

// --- Components ---

const ImagePlaceholder = ({ label, height = "h-64", className = "" }) => (
    <div className={`w-full ${height} bg-slate-200 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden group ${className}`}>
        <div className="absolute inset-0 bg-slate-100/50 group-hover:bg-slate-100/30 transition-colors" />
        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-medium text-sm z-10 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
            [画像: {label}]
        </span>
    </div>
);

const FeatureSection = ({ title, description, icon, imageLabel, reverse = false }) => (
    <div className="py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col lg:flex-row items-center gap-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-xl text-indigo-600 mb-6">
                        {icon}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        {description}
                    </p>
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-indigo-600 font-medium hover:text-indigo-700 transition-colors cursor-pointer group">
                        <span>詳しく見る</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>

                {/* Image Content */}
                <div className="flex-1 w-full relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${reverse ? 'from-purple-200 to-indigo-200' : 'from-indigo-200 to-purple-200'} rounded-3xl transform rotate-3 opacity-30 blur-2xl`}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl shadow-indigo-500/10 p-2 border border-slate-100">
                        <ImagePlaceholder label={imageLabel} height="h-80 md:h-96" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const BentoItem = ({ title, description, icon, className = "" }) => (
    <div className={`bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group ${className}`}>
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 text-indigo-600">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);

export default function Welcome({ auth }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Clinic CRM - 次世代のクリニック管理システム" />
            <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">

                {/* Navbar */}
                <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <span className="text-white font-bold text-xl">C</span>
                                </div>
                                <span className="font-bold text-2xl tracking-tight text-slate-900">Clinic<span className="text-indigo-600">CRM</span></span>
                            </div>

                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">機能</a>
                                <a href="#solutions" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">ソリューション</a>
                                <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">料金</a>
                            </div>

                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link href={route('home')} className="px-5 py-2.5 text-sm font-medium rounded-full text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                                        ダッシュボードへ
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('staff.login')} className="hidden sm:inline-block text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                            スタッフログイン
                                        </Link>
                                        <Link href="#" className="px-5 py-2.5 text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:scale-105">
                                            無料で試す
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    {/* Background Blobs */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-100/40 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-100/40 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-700 text-sm font-medium mb-8 shadow-sm animate-fade-in-up">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
                            AI搭載の予約管理システムが登場
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                            クリニック運営の<br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">すべてを、ひとつに。</span>
                        </h1>

                        <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
                            予約、カルテ、会計、スタッフ管理。煩雑な業務を自動化し、<br className="hidden md:block" />
                            患者様と向き合う時間を最大化する、次世代のCRMプラットフォーム。
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
                            <Link href="#" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all hover:scale-105">
                                今すぐ始める
                                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link href="#" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all hover:border-slate-300">
                                デモを見る
                            </Link>
                        </div>

                        {/* Dashboard Preview Hero Image */}
                        <div className="relative mx-auto max-w-6xl">
                            <div className="relative rounded-2xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:rounded-3xl lg:p-4 backdrop-blur-sm">
                                <div className="rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden">
                                    <ImagePlaceholder label="ダッシュボードのスクリーンショット" height="h-[300px] md:h-[600px]" className="border-0 rounded-none" />
                                </div>
                            </div>
                            {/* Floating Elements */}
                            <div className="absolute -right-12 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden lg:block animate-bounce-slow">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">本日の予約</p>
                                        <p className="text-lg font-bold text-slate-900">12件 完了</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats / Trust Section */}
                <div className="border-y border-slate-100 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { label: "導入クリニック", value: "500+" },
                                { label: "月間予約数", value: "10万+" },
                                { label: "業務削減時間", value: "30%" },
                                { label: "継続利用率", value: "99.8%" },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-3xl md:text-4xl font-extrabold text-indigo-600 mb-1">{stat.value}</div>
                                    <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feature 1: Smart Reservation */}
                <div id="features">
                    <FeatureSection
                        title="複雑な予約も、AIが瞬時に最適化"
                        description="スタッフのシフト、部屋の空き状況、機器の利用可否。これら全ての条件をリアルタイムで照合し、最適な予約枠を自動で提案します。ダブルブッキングの心配はもうありません。"
                        icon={
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                        imageLabel="予約カレンダー画面"
                    />

                    {/* Feature 2: Patient Portal */}
                    <FeatureSection
                        reverse
                        title="患者様に、最高の利便性を"
                        description="専用のマイページから、24時間いつでも予約・変更が可能。予約履歴の確認や、過去の施術内容の閲覧もスムーズに。電話対応の負担を大幅に削減します。"
                        icon={
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        }
                        imageLabel="スマホ版患者マイページ"
                    />

                    {/* Feature 3: Staff Management */}
                    <FeatureSection
                        title="チームの力を最大化する管理機能"
                        description="スタッフごとのスキルや役割に応じたシフト管理が可能。パフォーマンス分析機能により、クリニック全体の生産性向上をサポートします。"
                        icon={
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                        imageLabel="スタッフシフト管理画面"
                    />
                </div>

                {/* Bento Grid for Other Features */}
                <div className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                他にも、便利な機能がたくさん
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                クリニック運営に必要なあらゆるツールを、ひとつのパッケージに。
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <BentoItem
                                title="電子契約・同意書"
                                description="タブレットでのサインに対応。紙の保管場所はもう不要です。"
                                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                className="md:col-span-2 bg-indigo-50 border-indigo-100"
                            />
                            <BentoItem
                                title="リソース管理"
                                description="部屋や機器の稼働状況を可視化し、無駄をなくします。"
                                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                            />
                            <BentoItem
                                title="商品販売管理"
                                description="物販の在庫管理から売上分析まで対応。"
                                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                            />
                            <BentoItem
                                title="監査ログ"
                                description="「いつ」「誰が」「何を」したか、全ての操作を記録。"
                                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                            />
                            <BentoItem
                                title="完全日本語対応"
                                description="日本の商習慣に合わせたUI/UX設計。"
                                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>}
                            />
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-slate-900 py-24 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-3xl opacity-30 mix-blend-screen"></div>
                        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-3xl opacity-30 mix-blend-screen"></div>
                    </div>
                    <div className="max-w-4xl mx-auto px-4 relative text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                            クリニックの未来を、<br />ここから始めましょう。
                        </h2>
                        <p className="text-indigo-200 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                            導入相談から運用サポートまで、専任のチームがバックアップします。<br />
                            まずは無料デモで、その使いやすさを体験してください。
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="#" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-indigo-900 bg-white hover:bg-indigo-50 shadow-xl transition-all hover:scale-105">
                                無料デモを申し込む
                            </Link>
                            <Link href="#" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white border border-white/30 hover:bg-white/10 transition-all">
                                資料ダウンロード
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                            <div className="col-span-2 md:col-span-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">C</span>
                                    </div>
                                    <span className="font-bold text-xl text-slate-900">Clinic<span className="text-indigo-600">CRM</span></span>
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    医療現場の声から生まれた、<br />
                                    新しいクリニック管理システム。
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">製品</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li><a href="#" className="hover:text-indigo-600">機能一覧</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">料金プラン</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">導入事例</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">アップデート情報</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">サポート</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li><a href="#" className="hover:text-indigo-600">ヘルプセンター</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">APIドキュメント</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">お問い合わせ</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">システム稼働状況</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">会社情報</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li><a href="#" className="hover:text-indigo-600">会社概要</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">プライバシーポリシー</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">利用規約</a></li>
                                    <li><a href="#" className="hover:text-indigo-600">特定商取引法に基づく表記</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-slate-200 pt-8 text-center text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} ClinicCRM. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
