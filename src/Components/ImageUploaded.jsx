import React, { useEffect, useState } from 'react';

const ImageUploaded = ({ setFieldValue, resetTrigger }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("image", file);
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  useEffect(() => {
    setPreview(null);
    setFileName("No file chosen");
  }, [resetTrigger]);

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
      <div className="flex items-center space-x-4">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          <p className="mt-1 text-sm text-gray-500">{fileName}</p>
        </div>
        {preview && (
          <img
            src={preview}
            alt="Selected preview"
            className="w-20 h-20 object-cover rounded border"
          />
        )}
      </div>
    </div>
  );
};

export default ImageUploaded;
