import React, { useState, useRef } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import SignatureCanvas from 'react-signature-canvas';

export default function Sign({ auth, patient, templates }) {
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const sigCanvas = useRef({});
    
    const { data, setData, post, processing, errors } = useForm({
        document_template_id: '',
        signature_image: '',
        signed_content: '',
    });

    const handleTemplateChange = (e) => {
        const templateId = e.target.value;
        setSelectedTemplateId(templateId);
        const template = templates.find(t => t.id == templateId);
        
        setData(prev => ({
            ...prev,
            document_template_id: templateId,
            signed_content: template ? template.content : '',
        }));
    };

    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (sigCanvas.current.isEmpty()) {
            alert('署名してください。');
            return;
        }

        const signatureImage = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        
        // setDataは非同期ではないが、state更新のタイミングの問題があるため、
        // ここでは直接postのdataに含めるか、setDataしてからuseEffectで送信するなどの工夫が必要。
        // InertiaのuseFormのsetDataは即時反映されるが、post時のdataは現在のstateを使う。
        // ここでは、setDataを呼んでから、postの第二引数でデータを渡すことはできない（useFormの仕様）。
        // なので、transformを使うか、手動でデータを構築してrouter.postを使う手もあるが、
        // useFormのsetDataを使って、再レンダリング後に送信ボタンを押させるフローにするのが安全だが、
        // ここではsubmitハンドラ内で完結させたい。
        
        // useFormのdataを直接更新するのではなく、post時にデータをマージして送る機能はないため、
        // 一旦setDataして、次のレンダリングサイクルを待つ必要があるが、
        // ここではシンプルに、setDataを実行しつつ、postを実行する（ただし、Reactの状態更新は非同期なので注意）。
        // 確実なのは、router.postを使うことだが、useFormのエラーハンドリングを使いたい。
        
        // 解決策: useFormのtransformメソッドを使う。
        
        post(route('staff.documents.storeSignature', patient.id), {
            onBefore: () => {
                // ここでデータをセットできればいいが、onBeforeはリクエスト直前。
                // transformを使うのがベスト。
            },
        });
    };
    
    // transformを使って送信データを加工する
    // しかし、sigCanvasへの参照はsubmit時しか確定しない。
    // なので、submit時にsetDataして、その直後にpostすると古いデータが送られる可能性がある。
    // したがって、署名データをstateに保存するタイミングを「署名終了時」にするか、
    // あるいは router.post を使うのが無難。
    
    // ここでは router.post を使う形に書き換えるか、
    // あるいは、署名確定ボタンを押してから送信ボタンを押すフローにする。
    // ユーザビリティを考えると、送信ボタン一発でいきたい。
    
    // useFormのtransformを利用するパターン
    // ただしtransformは初期化時に定義する必要がある。
    
    // 今回は、useFormのdataにsignature_imageを持たせ、
    // 送信ボタン押下時に canvas からデータを取得して setData し、
    // その後 post するのは非同期問題で難しいので、
    // router.post を使って実装する。

    return (
        <StaffLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">電子署名</h2>}
        >
            <Head title="電子署名" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">患者: {patient.name} 様</h3>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="template">
                                    書類テンプレート選択
                                </label>
                                <select
                                    id="template"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={selectedTemplateId}
                                    onChange={handleTemplateChange}
                                >
                                    <option value="">選択してください</option>
                                    {templates.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.document_template_id && <div className="text-red-500 text-xs italic">{errors.document_template_id}</div>}
                            </div>

                            {selectedTemplateId && (
                                <>
                                    <div className="mb-6 border p-4 rounded bg-gray-50 h-96 overflow-y-scroll">
                                        <h4 className="font-bold mb-2">書類内容:</h4>
                                        <div className="whitespace-pre-wrap">
                                            {data.signed_content}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            署名
                                        </label>
                                        <div className="border border-gray-300 rounded inline-block">
                                            <SignatureCanvas 
                                                penColor="black"
                                                canvasProps={{width: 500, height: 200, className: 'sigCanvas'}}
                                                ref={sigCanvas}
                                                onEnd={() => {
                                                    setData('signature_image', sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
                                                }}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <button 
                                                type="button" 
                                                onClick={clearSignature}
                                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                                            >
                                                クリア
                                            </button>
                                        </div>
                                        {errors.signature_image && <div className="text-red-500 text-xs italic">{errors.signature_image}</div>}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            onClick={submit}
                                            disabled={processing}
                                        >
                                            署名を保存
                                        </button>
                                        <Link
                                            href={route('staff.patients.show', patient.id)}
                                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                        >
                                            キャンセル
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
