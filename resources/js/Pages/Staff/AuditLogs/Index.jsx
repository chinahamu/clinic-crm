import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ logs }) {
    const { auth } = usePage().props;

    return (
        <StaffLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">操作ログ</h2>}
        >
            <Head title="操作ログ" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日時</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作内容</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">対象</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">実行者ID</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.data.map((log) => (
                                        <tr key={log.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{log.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{log.subject_type} #{log.subject_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{log.causer_id ? `Staff #${log.causer_id}` : 'System'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            <div className="mt-4 flex">
                                {logs.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-4 py-2 border rounded mr-2 ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-4 py-2 border rounded mr-2 opacity-50 cursor-not-allowed bg-white text-gray-700"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
