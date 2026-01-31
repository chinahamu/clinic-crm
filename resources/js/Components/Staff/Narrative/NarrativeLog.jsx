import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { MessageCircle, Send } from 'lucide-react';

export default function NarrativeLog({ logs, patientId }) {
    // Helper helper to format datetime
    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const { data, setData, post, reset, processing } = useForm({
        content: '',
        emotional_tags: [], // Could implement tag selector later
    });

    const submitLog = (e) => {
        e.preventDefault();
        post(route('staff.patients.narrative-logs.store', patientId), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="bg-white shadow sm:rounded-lg flex flex-col h-[600px] mt-6">
            <div className="p-4 border-b border-gray-200 bg-teal-50 rounded-t-lg">
                <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 text-teal-600 mr-2" />
                    <h3 className="text-lg font-medium text-teal-900">Voice of Patient (語りの記録)</h3>
                </div>
                <p className="text-xs text-teal-600 mt-1">患者様の言葉をそのまま記録し、背景にある感情や文脈を共有しましょう。</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 border-x border-gray-200">
                {logs.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        まだ記録がありません。
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="flex flex-col">
                            <div className="flex items-baseline space-x-2 mb-1">
                                <span className="font-bold text-gray-700 text-sm">{log.staff?.name || 'スタッフ'}</span>
                                <span className="text-xs text-gray-400">{formatDateTime(log.created_at)}</span>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-gray-800 text-sm relative">
                                {/* Speech bubble triangle */}
                                <div className="absolute top-0 left-4 -mt-1.5 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                                <div className="whitespace-pre-wrap">{log.content}</div>
                                {log.emotional_tags && log.emotional_tags.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {/* Assuming emotional_tags is array of strings */}
                                        {/* Ensure it is parsed if it comes as string, though Eloquent cast should handle it */}
                                        {(Array.isArray(log.emotional_tags) ? log.emotional_tags : JSON.parse(log.emotional_tags || '[]')).map((tag, i) => (
                                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                <form onSubmit={submitLog} className="relative">
                    <textarea
                        rows="3"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm resize-none pr-12"
                        placeholder="患者様の言葉をそのまま記録してください..."
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        required
                    ></textarea>
                    <button
                        type="submit"
                        disabled={processing}
                        className="absolute bottom-2 right-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
