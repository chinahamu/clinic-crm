import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange, placeholder, variables = [] }) {
    const quillRef = useRef(null);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ],
        }
    }), []);

    const insertVariable = (variable) => {
        const quill = quillRef.current.getEditor();
        const cursorPosition = quill.getSelection()?.index || quill.getLength() - 1;
        quill.insertText(cursorPosition, `{{ ${variable.key} }}`);
        quill.setSelection(cursorPosition + variable.key.length + 5);
    };

    return (
        <div className="rich-text-editor">
            {variables.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-xs font-medium text-gray-500 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        変数を挿入:
                    </span>
                    {variables.map((variable) => (
                        <button
                            key={variable.key}
                            type="button"
                            onClick={() => insertVariable(variable)}
                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
                            title={variable.description}
                        >
                            {variable.label}
                        </button>
                    ))}
                </div>
            )}
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                placeholder={placeholder}
                className="bg-white rounded-lg"
            />
            <style>{`
                .ql-container {
                    border-bottom-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                    font-family: inherit;
                    font-size: 0.875rem;
                }
                .ql-toolbar {
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background-color: #f9fafb;
                }
                .ql-editor {
                    min-height: 300px;
                }
            `}</style>
        </div>
    );
}
