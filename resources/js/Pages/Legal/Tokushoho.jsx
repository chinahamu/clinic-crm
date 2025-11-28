import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Tokushoho() {
    return (
        <>
            <Head title="特定商取引法に基づく表記 - Clinic CRM" />
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
                        <h1 className="text-3xl font-bold text-slate-900 mb-12 text-center">特定商取引法に基づく表記</h1>
                        
                        <div className="space-y-8">
                            <Section title="販売業者">
                                株式会社メタアルケミスト
                            </Section>
                            
                            <Section title="運営統括責任者">
                                高松拳人
                            </Section>
                            
                            <Section title="所在地">
                                〒180-0004<br />
                                東京都武蔵野市吉祥寺本町１丁目２０番１号<br />
                                吉祥寺永谷シティプラザ１００２
                            </Section>
                            
                            <Section title="連絡先">
                                電話番号: 090-8398-2646<br />
                                メールアドレス: info@meta-alchemist.co.jp
                            </Section>
                            
                            <Section title="販売価格">
                                各サービス・コンテンツページに記載された価格<br />
                                価格は消費税込みの金額です。
                            </Section>
                            
                            <Section title="サービス利用料以外の必要料金">
                                インターネット接続料（お客様負担）<br />
                                通信費（お客様負担）
                            </Section>
                            
                            <Section title="お支払い方法">
                                クレジットカード決済（Visa、MasterCard、JCB、American Express）<br />
                                銀行振込<br />
                                オンライン決済サービス
                            </Section>
                            
                            <Section title="お支払い時期">
                                クレジットカード・オンライン決済: 決済完了時<br />
                                銀行振込: サービス利用開始前のお振込み確認後
                            </Section>
                            
                            <Section title="サービス提供時期">
                                オンラインサービス・デジタルコンテンツは、決済完了確認後、即座にご利用いただけます。<br />
                                一部のサービスについては、お申し込み後1営業日以内にアクセス情報をご提供いたします。
                            </Section>
                            
                            <Section title="返品・返金について">
                                デジタルコンテンツ・オンラインサービスの性質上、原則として返品・返金は承っておりません。<br />
                                ただし、以下の場合には返金対応いたします：<br />
                                <ul className="list-disc list-inside mt-2 ml-4 text-slate-600">
                                    <li>サービス内容に重大な不備があり、修正が困難な場合</li>
                                    <li>説明されたサービス内容と著しく異なる場合</li>
                                    <li>技術的な問題によりサービスが正常に提供できない場合</li>
                                </ul>
                                <p className="mt-2 text-sm text-slate-500">重要: 返金のご相談は、サービス利用開始から7日以内にご連絡ください。</p>
                            </Section>
                            
                            <Section title="個人情報の取り扱いについて">
                                お客様からお預かりした個人情報は、サービスの提供および付帯するサポートの範囲内で利用いたします。<br />
                                詳細は<Link href={route('privacy.policy')} className="text-indigo-600 hover:underline">プライバシーポリシー</Link>をご確認ください。
                            </Section>
                            
                            <Section title="免責事項">
                                当サイトのご利用につき、何らかのトラブルや損失・損害等につきましては一切責任を問わないものとします。
                            </Section>
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

const Section = ({ title, children }) => (
    <div className="border-b border-slate-100 pb-8 last:border-0">
        <h2 className="text-lg font-bold text-slate-900 mb-4">{title}</h2>
        <div className="text-slate-600 leading-relaxed">
            {children}
        </div>
    </div>
);
