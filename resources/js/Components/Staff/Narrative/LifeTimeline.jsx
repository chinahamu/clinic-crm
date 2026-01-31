import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Plus, Trash2, Calendar } from 'lucide-react';

export default function LifeTimeline({ lifeEvents, reservations, patientId }) {
    const [isAddingMode, setIsAddingMode] = useState(false);

    const { data: eventData, setData: setEventData, post: postEvent, reset: resetEvent, processing: processingEvent } = useForm({
        occurred_at: new Date().toISOString().split('T')[0],
        title: '',
        category: 'other',
        impact_level: 1,
    });

    // Deletion form handling (using Inertia delete helper or specific form if needed, often router.delete is simpler for single actions)
    // Using simple router delete for deletion to keep it simple, imported from inertia
    const { delete: destroy } = useForm();

    const submitEvent = (e) => {
        e.preventDefault();
        postEvent(route('staff.patients.life-events.store', patientId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddingMode(false);
                resetEvent();
            },
        });
    };

    const deleteEvent = (eventId) => {
        if (confirm('このライフイベントを削除してもよろしいですか？')) {
            destroy(route('staff.patients.life-events.destroy', [patientId, eventId]), {
                preserveScroll: true,
            });
        }
    };

    // Combine and sort events
    const allItems = [
        ...lifeEvents.map(e => ({ ...e, type: 'life_event', date: e.occurred_at })),
        ...(reservations || []).map(r => ({ ...r, type: 'reservation', date: r.reservation_date || r.visited_at, title: `来院 (${r.menu?.name || '詳細不明'})` }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending order

    return (
        <div className="bg-white shadow sm:rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">ライフ・ジャーニー (Timeline)</h3>
                <button
                    onClick={() => setIsAddingMode(!isAddingMode)}
                    className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100 text-sm font-medium"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    イベント追加
                </button>
            </div>

            {isAddingMode && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <form onSubmit={submitEvent} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">日付</label>
                                <input
                                    type="date"
                                    value={eventData.occurred_at}
                                    onChange={e => setEventData('occurred_at', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">イベント名</label>
                                <input
                                    type="text"
                                    value={eventData.title}
                                    onChange={e => setEventData('title', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="例: 娘の結婚式"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">カテゴリ</label>
                                <select
                                    value={eventData.category}
                                    onChange={e => setEventData('category', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                >
                                    <option value="family">家族</option>
                                    <option value="work">仕事</option>
                                    <option value="health">健康</option>
                                    <option value="other">その他</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">インパクト (重要度)</label>
                                <div className="mt-2 flex space-x-4">
                                    {[1, 2, 3].map(level => (
                                        <label key={level} className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-green-600"
                                                name="impact_level"
                                                value={level}
                                                checked={eventData.impact_level == level}
                                                onChange={() => setEventData('impact_level', level)}
                                            />
                                            <span className="ml-2">Lv.{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAddingMode(false)}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={processingEvent}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium shadow-sm"
                            >
                                追加
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                {allItems.map((item, index) => {
                    const isLifeEvent = item.type === 'life_event';
                    return (
                        <div key={`${item.type}-${item.id || index}`} className="relative pl-8">
                            {/* Dot */}
                            <span
                                className={`absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${isLifeEvent ? 'bg-orange-400' : 'bg-gray-400'
                                    }`}
                            >
                            </span>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                <h4 className={`text-base font-semibold ${isLifeEvent ? 'text-orange-900' : 'text-gray-900'}`}>
                                    {item.title}
                                </h4>
                                <time className="text-sm text-gray-500">{item.date}</time>
                            </div>

                            {isLifeEvent && (
                                <div className="mt-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                        {item.category === 'family' && '家族'}
                                        {item.category === 'work' && '仕事'}
                                        {item.category === 'health' && '健康'}
                                        {item.category === 'other' && 'その他'}
                                    </span>
                                    {item.impact_level > 1 && (
                                        <span className="ml-2 text-xs text-orange-600 font-bold">
                                            {'★'.repeat(item.impact_level)}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => deleteEvent(item.id)}
                                        className="ml-4 text-xs text-gray-400 hover:text-red-500"
                                    >
                                        削除
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                {allItems.length === 0 && (
                    <div className="pl-8 py-4 text-gray-500 text-sm">
                        イベントはまだ記録されていません。
                    </div>
                )}
            </div>
        </div>
    );
}
