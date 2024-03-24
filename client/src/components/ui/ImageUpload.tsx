import React, { useState } from 'react';

export default function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [processedFile, setProcessedFile] = useState<File | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);

        if (file) {
            // Convert the file to a base64 string
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64String = reader.result?.toString().split(',')[1];

                try {
                    const response = await fetch('http://127.0.0.1:5000/process-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: base64String }),
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Image processed!');
                        // Assuming the Flask response contains the processed image as base64
                        const processedImageBase64 = data.image;
                        setProcessedFile(processedImageBase64);
                    } else {
                        console.error('Failed to process image');
                    }
                } catch (error) {
                    console.error('Network error occurred', error);
                }
            };
            reader.onerror = (error) => {
                console.error('Error converting file to base64:', error);
            };
        }
    };
    // className='grid grid-flow-row gap-6 items-center'
    return (
        <div className='space-y-6'>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-56 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                        <svg className="w-6 h-6 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        {/* <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p> */}
                    </div>
                    <input id="dropzone-file" type="file" accept='image/*' className="hidden" onChange={handleFileChange} />
                </label>
            </div>

            <div className='flex align-middle justify-evenly space-x-4'>
                {selectedFile && (
                <div className='max-w-[47%]'>
                    <p className="text-base font-semibold">Original Image</p>
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className='rounded-lg'/>
                </div>
                )}              
                {processedFile && (
                <div className='max-w-[47%]'>
                    <p className="text-base font-semibold">Processed Image</p>
                    <img src={`data:image/jpeg;base64,${processedFile}`} alt="Processed" className='rounded-lg' />
                </div>
                )}
            </div>
        </div>

    );
}