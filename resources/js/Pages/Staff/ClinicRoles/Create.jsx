import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create({ clinics, roles }) {
    const { data, setData, post, processing, errors } = useForm({
        clinic_id: '',
        role_id: '',
        label: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.clinic-roles.store'));
    };

    return (
        <StaffLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">クリニック別ロール登録</h2>}>
            <Head title="クリニック別ロール登録" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">クリニック</label>
                                    <select value={data.clinic_id} onChange={e => setData('clinic_id', e.target.value)} className="w-full border rounded px-3 py-2">
                                        <option value="">選択してください</option>
                                        {clinics.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.clinic_id && <div className="text-red-500 text-xs mt-1">{errors.clinic_id}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">ロール</label>
                                    <select value={data.role_id} onChange={e => setData('role_id', e.target.value)} className="w-full border rounded px-3 py-2">
                                        <option value="">選択してください</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                    {errors.role_id && <div className="text-red-500 text-xs mt-1">{errors.role_id}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">ラベル（表示名）</label>
                                    <input type="text" value={data.label} onChange={e => setData('label', e.target.value)} className="w-full border rounded px-3 py-2" />
                                    {errors.label && <div className="text-red-500 text-xs mt-1">{errors.label}</div>}
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">保存</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
