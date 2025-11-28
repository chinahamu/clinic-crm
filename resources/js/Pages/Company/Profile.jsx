import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Profile() {
    return (
        <>
            <Head title="会社概要 - Clinic CRM" />
            <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
                {/* Navbar */}
                <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <Link href="/" className="flex items-center gap-2 cursor-pointer">
                                <img src="/img/logo.svg" alt="ClinicCRM Logo" className="w-10 h-10 shadow-lg shadow-indigo-500/20 rounded-xl" />
                                <span className="font-bold text-2xl tracking-tight text-slate-900">Clinic<span className="text-indigo-600">CRM</span></span>
                            </Link>
                            <div className="flex items-center space-x-4">
                                <Link href={route('staff.login')} className="hidden sm:inline-block text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                    スタッフログイン
                                </Link>
                                <Link href="/" className="px-5 py-2.5 text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:scale-105">
                                    トップへ戻る
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="pt-32 pb-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-12 text-center">会社概要</h1>
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <tbody>
                                    <TableRow label="法人名">株式会社メタアルケミスト</TableRow>
                                    <TableRow label="代表者">高松拳人</TableRow>
                                    <TableRow label="ホームページ">
                                        <a href="https://meta-alchemist.co.jp/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                            https://meta-alchemist.co.jp/
                                        </a>
                                    </TableRow>
                                    <TableRow label="資本金">100,000 JPY</TableRow>
                                    <TableRow label="設立年月">2024年1月</TableRow>
                                    <TableRow label="本社所在地">
                                        〒180-0004<br />
                                        東京都武蔵野市吉祥寺本町１丁目２０番１号<br />
                                        吉祥寺永谷シティプラザ１００２
                                    </TableRow>
                                    <TableRow label="業種">情報サービス業</TableRow>
                                    <TableRow label="従業員数">2名</TableRow>
                                    <TableRow label="代表電話番号">090-8398-2646</TableRow>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-16 text-center">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">ミッション</h2>
                            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                                中小企業の業務効率化を、AIとデータで実現します。<br />
                                「非効率→仕組み化」を30日スプリントで確実に定着させる、技術力をもったシステム開発会社です。
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                            <div className="col-span-2 md:col-span-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <img src="/img/logo.svg" alt="ClinicCRM Logo" className="w-8 h-8 rounded-lg" />
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
                                    <li><Link href="/#features" className="hover:text-indigo-600">機能一覧</Link></li>
                                    <li><Link href="/#pricing" className="hover:text-indigo-600">料金プラン</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">サポート</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li><a href="#" className="hover:text-indigo-600">お問い合わせ</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4">会社情報</h4>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li><Link href={route('company.profile')} className="hover:text-indigo-600">会社概要</Link></li>
                                    <li><Link href={route('privacy.policy')} className="hover:text-indigo-600">プライバシーポリシー</Link></li>
                                    <li><Link href={route('legal.tokushoho')} className="hover:text-indigo-600">特定商取引法に基づく表記</Link></li>
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

const TableRow = ({ label, children }) => (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
        <th className="py-4 px-6 font-medium text-slate-900 w-1/3 align-top bg-slate-50/50">{label}</th>
        <td className="py-4 px-6 text-slate-600">{children}</td>
    </tr>
);
