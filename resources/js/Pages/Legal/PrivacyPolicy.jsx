import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="プライバシーポリシー - Clinic CRM" />
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
                        <h1 className="text-3xl font-bold text-slate-900 mb-12 text-center">プライバシーポリシー</h1>
                        
                        <div className="prose prose-slate max-w-none">
                            <p className="mb-8">
                                株式会社メタアルケミスト（以下、「当サイト」といいます。）は、当サイト上で提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
                            </p>

                            <Section title="第1条（個人情報）">
                                「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
                            </Section>

                            <Section title="第2条（個人情報の収集方法）">
                                当サイトでは、ユーザーがお問い合わせフォームを利用する際に、氏名、メールアドレス等の個人情報をお尋ねすることがあります。また、ユーザーがコメントを投稿する際に、氏名、メールアドレス、ウェブサイトのURLを収集します。
                            </Section>

                            <Section title="第3条（個人情報を収集・利用する目的）">
                                当サイトが個人情報を収集・利用する目的は、以下のとおりです。
                                <ul className="list-disc list-inside mt-2 ml-4">
                                    <li>お問い合わせへの対応のため</li>
                                    <li>コメントの管理のため</li>
                                    <li>スパム対策のため（Akismetプラグインによる）</li>
                                    <li>当サイトの利用状況を分析し、サービスを向上させるため（Google Analyticsによる）</li>
                                    <li>上記の利用目的に付随する目的</li>
                                </ul>
                            </Section>

                            <Section title="第4条（安全管理措置）">
                                当サイトは、取り扱う個人情報の漏えい、滅失またはき損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。
                            </Section>

                            <Section title="第5条（個人情報の第三者提供）">
                                当サイトは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
                                <ul className="list-disc list-inside mt-2 ml-4">
                                    <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                                    <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                                    <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                                    <li>利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合</li>
                                </ul>
                            </Section>

                            <Section title="第6条（外国にある第三者への提供と外部送信）">
                                当サイトは、以下の外部サービスを利用しており、ユーザーの情報を外部の事業者に送信することがあります。
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h4 className="font-bold">Google Analytics</h4>
                                        <ul className="list-disc list-inside ml-4 text-sm">
                                            <li>送信先事業者: Google LLC</li>
                                            <li>送信先の国: アメリカ合衆国</li>
                                            <li>送信される情報: 閲覧ページのURL、IPアドレス、閲覧日時、ユーザーエージェント等</li>
                                            <li>利用目的: サイトの利用状況分析のため</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Akismet Anti-Spam</h4>
                                        <ul className="list-disc list-inside ml-4 text-sm">
                                            <li>送信先事業者: Automattic Inc.</li>
                                            <li>送信先の国: アメリカ合衆国</li>
                                            <li>送信される情報: コメント投稿者のIPアドレス、ユーザーエージェント、リファラー、サイトURL、コメント内容等</li>
                                            <li>利用目的: スパムコメントの検出と防止のため</li>
                                        </ul>
                                    </div>
                                </div>
                            </Section>

                            <Section title="第7条（個人情報の開示、訂正等）">
                                <ol className="list-decimal list-inside ml-4">
                                    <li>当サイトは、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。</li>
                                    <li>ユーザーは、当サイトの保有する自己の個人情報が誤った情報である場合には、当サイトが定める手続きにより、個人情報の訂正、追加または削除を請求することができます。</li>
                                    <li>手続きの詳細については、下記のお問い合わせ窓口までご連絡ください。</li>
                                </ol>
                            </Section>

                            <Section title="第8条（Cookieについて）">
                                当サイトでは、アクセス解析や利便性の向上のためにCookieを使用しています。Cookieとは、ユーザーのコンピュータ内に記録される小さなテキストファイルですが、これにより個人を特定できる情報を収集するものではありません。ユーザーはブラウザの設定によりCookieを無効にすることができます。
                            </Section>

                            <Section title="第9条（プライバシーポリシーの変更）">
                                本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。変更後のプライバシーポリシーは、当サイトに掲載したときから効力を生じるものとします。
                            </Section>

                            <Section title="第10条（お問い合わせ窓口）">
                                本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
                                <div className="mt-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <p><strong>社名:</strong> 株式会社メタアルケミスト</p>
                                    <p><strong>住所:</strong> 〒180-0004 東京都武蔵野市吉祥寺本町１丁目２０番１号吉祥寺永谷シティプラザ１００２</p>
                                    <p><strong>代表者:</strong> 高松拳人</p>
                                    <p><strong>Eメールアドレス:</strong> info@meta-alchemist.co.jp</p>
                                </div>
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
    <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">{title}</h2>
        <div className="text-slate-600 leading-relaxed">
            {children}
        </div>
    </div>
);
