import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";

const Upload = () => {
    const { fs, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        try {
            setStatusText('Uploading the file...');
            const uploadedFile = await fs.upload([file]);
            if(!uploadedFile) {
                setStatusText('Error: Failed to upload file');
                setIsProcessing(false);
                return;
            }

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            if(!imageFile.file) {
                setStatusText('Error: Failed to convert PDF to image');
                setIsProcessing(false);
                return;
            }

            setStatusText('Uploading the image...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if(!uploadedImage) {
                setStatusText('Error: Failed to upload image');
                setIsProcessing(false);
                return;
            }

            setStatusText('Preparing data...');
            const uuid = generateUUID();
            const data: Omit<Resume, 'feedback'> & { jobDescription: string; feedback: Feedback | '' } = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: '',
            };
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analyzing...');
            const formData = new FormData();
            formData.append('file', file);
            formData.append('jobTitle', jobTitle);
            formData.append('jobDescription', jobDescription);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.ok) {
                setStatusText(`Error: ${result.error || 'Failed to analyze resume'}`);
                setIsProcessing(false);
                return;
            }

            data.feedback = result.feedback;
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            console.log(data);
            navigate(`/resume/${uuid}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected error';
            setStatusText(`Error: ${message}`);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <p className="section-kicker">High-impact upload flow</p>
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <p className="section-copy">
                                We are preparing your file, extracting the content, and building your feedback dashboard.
                            </p>
                            <div className="gradient-border w-full max-w-4xl">
                                <img src="/images/resume-scan.gif" className="w-full rounded-[1.5rem]" />
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>Drop your resume for an ATS score and focused improvement tips</h2>
                            <p className="section-copy">
                                Add the role context, upload your PDF, and get a review experience that feels clear enough to act on right away.
                            </p>
                        </>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="panel-card mt-6 max-w-4xl gap-5 text-left">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
