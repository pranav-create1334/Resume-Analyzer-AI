import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;

        setSelectedFile(file);
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    return (
        <div className="w-full gradient-border">
            <div
                {...getRootProps()}
                className={`uplader-drag-area ${isDragActive ? 'border-[#516eff] bg-[#eef2ff]' : ''}`}
            >
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {selectedFile ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f4efe9]">
                                <img src="/images/pdf.png" alt="pdf" className="size-9" />
                            </div>
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="max-w-xs truncate text-sm font-semibold text-slate-800">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {formatSize(selectedFile.size)}
                                    </p>
                                </div>
                            </div>
                            <button className="rounded-full border border-slate-200 bg-white/80 p-2 cursor-pointer transition hover:border-slate-300" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(null);
                                onFileSelect?.(null)
                            }}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ): (
                        <div>
                            <div className="mx-auto mb-3 flex h-18 w-18 items-center justify-center rounded-full border border-white/70 bg-[linear-gradient(135deg,#fff8f1,#f1f4ff)] shadow-[0_16px_35px_rgba(48,40,29,0.08)]">
                                <img src="/icons/info.svg" alt="upload" className="size-12" />
                            </div>
                            <p className="text-lg text-slate-600">
                                <span className="font-semibold text-slate-900">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">PDF only, up to {formatSize(maxFileSize)}</p>
                            <div className="uploader-hint-grid">
                                <div className="uploader-hint">
                                    <strong>Preferred</strong>
                                    <span>Clean one-page PDF layouts are easiest to review.</span>
                                </div>
                                <div className="uploader-hint">
                                    <strong>Best result</strong>
                                    <span>Use a role-specific description for sharper feedback.</span>
                                </div>
                                <div className="uploader-hint">
                                    <strong>Included</strong>
                                    <span>ATS score, structure review, and improvement tips.</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
