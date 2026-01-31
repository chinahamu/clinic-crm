import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useForm } from '@inertiajs/react';

const DEFAULT_ATTRIBUTES = [
    'コスト重視',
    '効果の持続',
    'ダウンタイム許容',
    '安全性',
    '自然的仕上がり'
];

export default function ValueCompass({ patientValues, patientId }) {
    const [isEditing, setIsEditing] = useState(false);

    // Merge existing values with defaults
    const getInitialValues = () => {
        return DEFAULT_ATTRIBUTES.map(attr => {
            const existing = patientValues.find(v => v.attribute_name === attr);
            return {
                attribute_name: attr,
                score: existing ? existing.score : 3, // Default score 3
                notes: existing ? existing.notes : '',
            };
        });
    };

    const { data, setData, post, processing } = useForm({
        values: getInitialValues(),
    });

    // Formatting for chart
    const chartData = data.values.map(v => ({
        subject: v.attribute_name,
        A: v.score,
        fullMark: 5,
    }));

    const handleScoreChange = (index, newScore) => {
        const newValues = [...data.values];
        newValues[index].score = parseInt(newScore);
        setData('values', newValues);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.patients.values.update', patientId), {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">バリュー・コンパス (価値観)</h3>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                >
                    {isEditing ? 'キャンセル' : '編集'}
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} />
                            <Radar
                                name="Patient Values"
                                dataKey="A"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {isEditing && (
                    <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6 border-l border-gray-100">
                        <form onSubmit={submit}>
                            <div className="space-y-4">
                                {data.values.map((item, index) => (
                                    <div key={item.attribute_name}>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-sm font-medium text-gray-700">{item.attribute_name}</label>
                                            <span className="text-sm text-gray-500 font-bold">{item.score}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            value={item.score}
                                            onChange={(e) => handleScoreChange(index, e.target.value)}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    保存する
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
