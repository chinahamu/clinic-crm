import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

// -------------------------------------------------------------------
// KPIカード
// -------------------------------------------------------------------
const KpiCard = ({ title, value, diff, accent }) => {
    const accentMap = {
        blue: 'border-blue-200   bg-blue-50',
        green: 'border-green-200  bg-green-50',
        purple: 'border-purple-200 bg-purple-50',
        amber: 'border-amber-200  bg-amber-50',
    };
    const isUp = diff !== null && parseFloat(diff) >= 0;

    return (
        <div className={`rounded-xl border p-5 ${accentMap[accent] ?? accentMap.blue}`}>
            <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
            {diff !== null && (
                <p className={`mt-1 text-xs font-medium ${isUp ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                    {isUp ? '▲' : '▼'} 先月比 {Math.abs(parseFloat(diff)).toFixed(1)}%
                </p>
            )}
            {diff === null && (
                <p className="mt-1 text-xs text-gray-400">累計平均値</p>
            )}
        </div>
    );
};

// -------------------------------------------------------------------
// 来院トレンドグラフ（pure CSSバーチャート — 外部ライブラリ不要）
// -------------------------------------------------------------------
const VisitTrendChart = ({ data }) => {
    const maxVal = Math.max(...data.map(d => (d.new ?? 0) + (d.repeat ?? 0)), 1);

    return (
        <div>
            <div className="flex items-end gap-px" style={{ height: '128px' }}>
                {data.map((item, i) => {
                    const total = (item.new ?? 0) + (item.repeat ?? 0);
                    const pct = (total / maxVal) * 100;
                    const newPct = total > 0 ? ((item.new ?? 0) / total) * 100 : 0;
                    return (
                        <div key={i} className="flex flex-col justify-end flex-1" style={{ height: '100%' }}>
                            <div
                                className="w-full flex flex-col overflow-hidden rounded-t"
                                style={{ height: `${pct}%` }}
                                title={`新規: ${item.new} / リピート: ${item.repeat}`}
                            >
                                {/* リピート層（上） */}
                                <div className="bg-emerald-400 w-full" style={{ height: `${100 - newPct}%` }} />
                                {/* 新規層（下） */}
                                <div className="bg-blue-400 w-full" style={{ height: `${newPct}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* X軸ラベル */}
            <div className="flex gap-px mt-1">
                {data.map((item, i) => (
                    <div key={i} className="flex-1 text-center">
                        <span className="text-[10px] text-gray-400">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* 凡例 */}
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" />
                    新規来院
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" />
                    リピート
                </span>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------
// メインコンポーネント
// -------------------------------------------------------------------
export default function KpiDashboard({ kpi, visit_trend, scenario_effect, dormant_patients }) {
    const { auth } = usePage().props;

    const diffPct = (cur, last) =>
        last > 0 ? (((cur - last) / last) * 100).toFixed(1) : null;

    const handleTriggerScenario = (patientId, patientName) => {
        if (!confirm(`「${patientName}」さんに休眠復帰シナリオをLINE配信しますか？`)) return;
        router.post(
            route('staff.patients.trigger-scenario', patientId),
            { trigger_type: 'no_visit_60d' },
            { preserveScroll: true },
        );
    };

    return (
        <StaffLayout
            user={auth.user}
            header="KPI ダッシュボード"
        >
            <Head title="KPI ダッシュボード" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* ページヘッダー */}
                <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">KPI ダッシュボード</h1>
                    <p className="text-sm text-gray-500 mt-0.5">クリニック経営指標の概要</p>
                </div>

                {/* KPI カード × 4 */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    <KpiCard
                        title="今月の来院数"
                        value={`${kpi.visit_count.toLocaleString()} 件`}
                        diff={diffPct(kpi.visit_count, kpi.last_visit_count)}
                        accent="blue"
                    />
                    <KpiCard
                        title="新規患者数"
                        value={`${kpi.new_patients.toLocaleString()} 名`}
                        diff={diffPct(kpi.new_patients, kpi.last_new_patients)}
                        accent="green"
                    />
                    <KpiCard
                        title="月次売上"
                        value={`¥${kpi.monthly_sales.toLocaleString()}`}
                        diff={diffPct(kpi.monthly_sales, kpi.last_monthly_sales)}
                        accent="purple"
                    />
                    <KpiCard
                        title="患者平均 LTV"
                        value={`¥${kpi.avg_ltv.toLocaleString()}`}
                        diff={null}
                        accent="amber"
                    />
                </div>

                {/* 来院トレンド + シナリオ効果 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* 来院トレンドグラフ */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-700 mb-5">
                            来院トレンド
                            <span className="ml-1.5 text-xs font-normal text-gray-400">（過去12ヶ月）</span>
                        </h2>
                        <VisitTrendChart data={visit_trend} />
                    </div>

                    {/* シナリオ配信効果 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-700 mb-5">
                            シナリオ配信効果
                            <span className="ml-1.5 text-xs font-normal text-gray-400">（今月）</span>
                        </h2>
                        <dl className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <dt className="text-sm text-gray-600">配信成功</dt>
                                <dd className="text-xl font-bold text-emerald-600">
                                    {scenario_effect.sent.toLocaleString()}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <dt className="text-sm text-gray-600">
                                    スキップ
                                    <span className="text-xs text-gray-400 ml-1">LINE未連携</span>
                                </dt>
                                <dd className="text-xl font-bold text-amber-500">
                                    {scenario_effect.skipped.toLocaleString()}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <dt className="text-sm text-gray-600">送信失敗</dt>
                                <dd className={`text-xl font-bold ${scenario_effect.failed > 0 ? 'text-red-500' : 'text-gray-300'
                                    }`}>
                                    {scenario_effect.failed.toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* 休眠患者テーブル */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 mb-5">
                        要アクション患者
                        <span className="ml-1.5 text-xs font-normal text-gray-400">
                            （休眠 60 日以上 · 最大20名）
                        </span>
                    </h2>

                    {dormant_patients.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">✨ 休眠患者はいません</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                                        <th className="pb-3 font-medium pr-4">患者名</th>
                                        <th className="pb-3 font-medium pr-4">最終来院日</th>
                                        <th className="pb-3 font-medium pr-4 text-right">LTV</th>
                                        <th className="pb-3 font-medium pr-4 text-right">来院回数</th>
                                        <th className="pb-3 font-medium pr-4 text-center">LINE</th>
                                        <th className="pb-3 font-medium text-center">アクション</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {dormant_patients.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 pr-4 font-medium text-gray-800">
                                                <a
                                                    href={route('staff.patients.show', p.id)}
                                                    className="hover:text-blue-600 hover:underline"
                                                >
                                                    {p.name}
                                                </a>
                                            </td>
                                            <td className="py-3 pr-4 text-gray-500">
                                                {p.last_visit_at ?? '—'}
                                            </td>
                                            <td className="py-3 pr-4 text-right tabular-nums text-gray-700">
                                                ¥{(p.ltv ?? 0).toLocaleString()}
                                            </td>
                                            <td className="py-3 pr-4 text-right tabular-nums text-gray-700">
                                                {p.visit_count}
                                            </td>
                                            <td className="py-3 pr-4 text-center">
                                                {p.has_line ? (
                                                    <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5">
                                                        連携済
                                                    </span>
                                                ) : (
                                                    <span className="inline-block rounded-full bg-gray-100 text-gray-400 text-[10px] font-medium px-2 py-0.5">
                                                        未連携
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 text-center">
                                                <button
                                                    onClick={() => handleTriggerScenario(p.id, p.name)}
                                                    disabled={!p.has_line}
                                                    className="text-xs px-3 py-1.5 rounded-lg font-medium
                                                               bg-emerald-50 text-emerald-700 border border-emerald-200
                                                               hover:bg-emerald-100 transition-colors
                                                               disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    LINE送信
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </StaffLayout>
    );
}
