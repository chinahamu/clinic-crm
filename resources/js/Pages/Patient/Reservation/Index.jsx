import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DateSelection from './DateSelection';

export default function Index({ clinic, menus }) {
    const [selectedMenu, setSelectedMenu] = useState(null);

    return (
        <>
            <Head title={`${clinic.name} - 予約`} />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="font-bold text-xl text-slate-900">
                            {clinic.name}
                        </div>
                        <div className="text-sm text-slate-500">
                            新規予約
                        </div>
                    </div>
                </header>

                <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {selectedMenu ? (
                        <DateSelection
                            clinic={clinic}
                            menu={selectedMenu}
                            onBack={() => setSelectedMenu(null)}
                        />
                    ) : (
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">メニューを選択してください</h1>
                                <p className="text-slate-600">ご希望の施術メニューをお選びください。</p>
                            </div>

                            <div className="grid gap-4">
                                {menus.length > 0 ? (
                                    menus.map((menu) => (
                                        <div
                                            key={menu.id}
                                            onClick={() => setSelectedMenu(menu)}
                                            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {menu.name}
                                                    </h3>
                                                    {menu.description && (
                                                        <p className="text-slate-600 mt-1 text-sm">
                                                            {menu.description}
                                                        </p>
                                                    )}
                                                    <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                                                        <div className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {menu.duration_minutes}分
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-lg font-bold text-slate-900">
                                                    ¥{menu.price.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                                        <p className="text-slate-500">現在利用可能なメニューはありません。</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}
