import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Dashboard() {
    const { auth } = usePage().props;

    return (
        <StaffLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">スタッフダッシュボード</h2>}
        >
            <Head title="スタッフダッシュボード" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            スタッフ用管理画面へようこそ。
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                <a href={route('staff.reservations.index')} className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100">
                                    <h3 className="font-bold text-lg mb-2">予約管理</h3>
                                    <p>本日の予約状況の確認・ステータス変更</p>
                                </a>
                                <a href={route('staff.shifts.index')} className="block p-6 bg-green-50 rounded-lg hover:bg-green-100">
                                    <h3 className="font-bold text-lg mb-2">シフト管理</h3>
                                    <p>スタッフのシフト登録・確認</p>
                                </a>
                                <a href={route('staff.menus.index')} className="block p-6 bg-purple-50 rounded-lg hover:bg-purple-100">
                                    <h3 className="font-bold text-lg mb-2">メニュー管理</h3>
                                    <p>施術メニューとリソース設定の編集</p>
                                </a>
                                <a href={route('staff.patients.index')} className="block p-6 bg-yellow-50 rounded-lg hover:bg-yellow-100">
                                    <h3 className="font-bold text-lg mb-2">患者管理</h3>
                                    <p>患者情報の検索・閲覧・編集</p>
                                </a>
                                <a href={route('staff.members.index')} className="block p-6 bg-indigo-50 rounded-lg hover:bg-indigo-100">
                                    <h3 className="font-bold text-lg mb-2">スタッフ管理</h3>
                                    <p>スタッフアカウントと権限の管理</p>
                                </a>
                                <a href={route('staff.audit-logs.index')} className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100">
                                    <h3 className="font-bold text-lg mb-2">操作ログ</h3>
                                    <p>システム操作履歴と監査ログの確認</p>
                                </a>
                                <a href={route('staff.products.index')} className="block p-6 bg-pink-50 rounded-lg hover:bg-pink-100">
                                    <h3 className="font-bold text-lg mb-2">商品管理</h3>
                                    <p>物販商品・オプションの登録・編集</p>
                                </a>
                                <a href={route('staff.documents.index')} className="block p-6 bg-teal-50 rounded-lg hover:bg-teal-100">
                                    <h3 className="font-bold text-lg mb-2">書類テンプレート</h3>
                                    <p>同意書・契約書等のテンプレート管理</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
