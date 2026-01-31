import React, { useState, Fragment } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Tab, Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Dashboard({ auth, reservations, contracts, documents }) {
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    const categories = {
        '予約管理': 'appointments',
        '契約・コース': 'plans',
        '書類・同意書': 'documents',
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="マイページ"
        >
            <Head title="マイページ" />

            <div className="space-y-6">
                {/* Welcome Message */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">ようこそ、{auth.user.name} 様</h3>
                        <p className="text-gray-500">各種履歴や契約状況をご確認いただけます。</p>
                    </div>
                    <button
                        onClick={() => setIsQrModalOpen(true)}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 6h6v6H6V6zm12 0h6v6h-6V6zm-6 12h6v6h-6v-6zm-6 0h6v6H6v-6z" /></svg>
                        会員証 / チェックイン
                    </button>
                </div>

                {/* Tabs */}
                <div className="w-full px-2 sm:px-0">
                    <Tab.Group>
                        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1">
                            {Object.keys(categories).map((category) => (
                                <Tab
                                    key={category}
                                    className={({ selected }) =>
                                        classNames(
                                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                            selected
                                                ? 'bg-white text-blue-700 shadow'
                                                : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-800'
                                        )
                                    }
                                >
                                    {category}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="mt-4 text-left">
                            {/* Appointments Tab */}
                            <Tab.Panel className={classNames('rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2')}>
                                <div className="space-y-8 p-4">
                                    {/* Future Reservations */}
                                    <section>
                                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </span>
                                            次回の予約
                                        </h4>
                                        {reservations.future && reservations.future.length > 0 ? (
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {reservations.future.map((reservation) => (
                                                    <div key={reservation.id} className="border border-blue-100 bg-blue-50/30 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="text-lg font-bold text-blue-900">
                                                                {format(new Date(reservation.start_time), 'yyyy年M月d日(EEE) HH:mm', { locale: ja })}
                                                            </div>
                                                            <span className="px-2.5 py-1 bg-white text-blue-700 text-xs font-bold rounded-full border border-blue-100 shadow-sm">
                                                                確定
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2 text-sm text-gray-600">
                                                            <div className="flex items-center">
                                                                <span className="w-20 text-gray-400">クリニック</span>
                                                                <span className="font-medium text-gray-700">{reservation.clinic?.name}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="w-20 text-gray-400">メニュー</span>
                                                                <span className="font-medium text-gray-700">{reservation.menu?.name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                現在、予約はありません。
                                            </div>
                                        )}
                                    </section>

                                    {/* Past Reservations */}
                                    <section>
                                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <span className="bg-gray-100 text-gray-600 p-2 rounded-lg mr-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </span>
                                            施術履歴
                                        </h4>
                                        {reservations.past && reservations.past.length > 0 ? (
                                            <div className="overflow-hidden bg-white border border-gray-100 rounded-xl">
                                                <ul className="divide-y divide-gray-100">
                                                    {reservations.past.map((reservation) => (
                                                        <li key={reservation.id} className="p-4 hover:bg-gray-50 transition">
                                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                                <div>
                                                                    <p className="text-sm font-bold text-gray-900">
                                                                        {format(new Date(reservation.start_time), 'yyyy年M月d日(EEE) HH:mm', { locale: ja })}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        {reservation.menu?.name} <span className="text-gray-300">|</span> {reservation.clinic?.name}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-lg">施術完了</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                履歴はありません。
                                            </div>
                                        )}
                                    </section>
                                </div>
                            </Tab.Panel>

                            {/* Contracts Tab */}
                            <Tab.Panel className={classNames('rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2')}>
                                <div className="space-y-4 p-4">
                                    {contracts && contracts.length > 0 ? (
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {contracts.map((contract) => (
                                                <div key={contract.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-2 opacity-5">
                                                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    </div>
                                                    <div className="relative z-10">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h5 className="font-bold text-gray-900 line-clamp-1" title={contract.menu?.name}>
                                                                {contract.menu?.name}
                                                            </h5>
                                                            {contract.remaining_count > 0 ? (
                                                                <span className="shrink-0 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-bold">有効</span>
                                                            ) : (
                                                                <span className="shrink-0 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-bold">終了</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mb-4">
                                                            契約日: {format(new Date(contract.contract_date), 'yyyy/MM/dd', { locale: ja })}
                                                        </div>

                                                        {/* Usage Progress */}
                                                        <div className="mt-4">
                                                            <div className="flex justify-between text-sm mb-1">
                                                                <span className="text-gray-600">消化状況</span>
                                                                <span className="font-bold text-gray-900">
                                                                    残 {contract.remaining_count}回 <span className="text-gray-400 text-xs font-normal">/ 全{contract.total_count}回</span>
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                                <div
                                                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                                                    style={{ width: `${Math.min(100, ((contract.total_count - contract.remaining_count) / contract.total_count) * 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-400">
                                            契約中のコースはありません。
                                        </div>
                                    )}
                                </div>
                            </Tab.Panel>

                            {/* Documents Tab */}
                            <Tab.Panel className={classNames('rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2')}>
                                <div className="p-4">
                                    {documents && documents.length > 0 ? (
                                        <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                                            {documents.map((doc) => (
                                                <li key={doc.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-gray-50/50 transition bg-white">
                                                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                                        <div className="bg-red-50 text-red-500 p-2 rounded-lg">
                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v5h5v11H6z" /></svg>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-medium text-gray-900">{doc.title}</h5>
                                                            <p className="text-xs text-gray-500">
                                                                署名日: {format(new Date(doc.signed_at), 'yyyy年M月d日', { locale: ja })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex-shrink-0">
                                                        <a
                                                            href={route('my-page.documents.download', doc.id)}
                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                            PDFダウンロード
                                                        </a>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-12 text-gray-400">
                                            署名済みの書類はありません。
                                        </div>
                                    )}
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>

            {/* QR Code Modal for Check-in */}
            <Transition appear show={isQrModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsQrModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-bold leading-6 text-gray-900 mb-6"
                                    >
                                        会員証 / チェックイン
                                    </Dialog.Title>
                                    <div className="flex flex-col items-center justify-center space-y-6">
                                        <div className="p-4 bg-white border-2 border-gray-900 rounded-xl">
                                            <QRCodeSVG
                                                value={JSON.stringify({ user_id: auth.user.id, type: 'checkin' })}
                                                size={200}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <p>受付の端末にQRコードをかざしてください。</p>
                                        </div>
                                        <div className="w-full pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-400 mb-1">会員ID</p>
                                            <p className="font-mono font-bold text-gray-900 text-lg">{auth.user.id.toString().padStart(6, '0')}</p>
                                            <p className="font-bold text-gray-900 mt-1">{auth.user.name} 様</p>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-xl border border-transparent bg-gray-100 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 w-full"
                                            onClick={() => setIsQrModalOpen(false)}
                                        >
                                            閉じる
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AuthenticatedLayout>
    );
}

