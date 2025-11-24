import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Clinic CRMへようこそ" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
                {/* Navbar */}
                <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <span className="text-white font-bold text-xl">C</span>
                                </div>
                                <span className="font-bold text-2xl tracking-tight text-slate-900">Clinic<span className="text-indigo-600">CRM</span></span>
                            </div>
                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">機能</a>
                                <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">お客様の声</a>
                                <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">料金</a>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('home')}
                                        className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                                    >
                                        ダッシュボード
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('staff.login')}
                                            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                                        >
                                            スタッフログイン
                                        </Link>
                                        <Link
                                            href="#"
                                            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                                        >
                                            はじめる
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply filter"></div>
                        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply filter"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8 animate-fade-in-up">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                            新機能: AIによるスケジュール管理
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                            クリニック運営を、 <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">もっとスマートに。</span>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
                            予約、患者カルテ、スタッフ管理を効率化。<br />
                            現代の医療施設のために設計された、最も直感的なCRMです。
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="#"
                                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all hover:scale-105"
                            >
                                無料トライアルを始める
                            </Link>
                            <Link
                                href="#"
                                className="inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-lg font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
                            >
                                デモを見る
                            </Link>
                        </div>

                        {/* Dashboard Preview */}
                        <div className="mt-20 relative mx-auto max-w-5xl">
                            <div className="rounded-2xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:rounded-3xl lg:p-4">
                                <div className="rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden">
                                    <div className="aspect-[16/9] bg-slate-50 flex items-center justify-center text-slate-400">
                                        {/* Placeholder for a dashboard screenshot */}
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                            </svg>
                                            <span className="mt-2 block text-sm font-medium">ダッシュボード プレビュー</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div id="features" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">機能</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                クリニック運営に必要なすべてを
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                                患者様へのケアに集中するための、強力なツール。
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                {
                                    title: "患者ポータル機能",
                                    description: "ログイン・新規登録から、予約履歴の確認まで。患者様のための専用マイページを提供します。",
                                    icon: (
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "スマート予約システム",
                                    description: "スタッフ、部屋、機器の空き状況をリアルタイムで判定。最適な日時を自動で提案します。",
                                    icon: (
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "包括的なスタッフ管理",
                                    description: "シフト管理からパフォーマンス追跡まで、スタッフ業務を一元管理。",
                                    icon: (
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "リソース管理",
                                    description: "施術メニュー、販売商品、部屋、医療機器。クリニックの全リソースを効率的に管理します。",
                                    icon: (
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "契約・消化管理",
                                    description: "コース契約の作成から、日々の消化状況の追跡まで。複雑な契約管理をシンプルに。",
                                    icon: (
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "日本語対応・監査ログ",
                                    description: "完全な日本語インターフェースと、安心の操作ログ記録機能で、安全な運用をサポート。",
                                    icon: (
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    )
                                }
                            ].map((feature, index) => (
                                <div key={index} className="relative group p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-3xl"></div>
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-slate-900 py-24 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl opacity-30"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl opacity-30"></div>
                    </div>
                    <div className="max-w-4xl mx-auto px-4 relative text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">クリニックを変革する準備はできましたか？</h2>
                        <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
                            ClinicCRMを信頼して、より良い患者ケアを提供している数千の医療機関に加わりましょう。
                        </p>
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-indigo-900 bg-white hover:bg-indigo-50 shadow-xl transition-all hover:scale-105"
                        >
                            今すぐ始める
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-slate-50 py-12 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">C</span>
                            </div>
                            <span className="font-bold text-lg text-slate-900">Clinic<span className="text-indigo-600">CRM</span></span>
                        </div>
                        <div className="text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} ClinicCRM. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
