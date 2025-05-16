import React, { useState } from 'react';

const ImageUploaded = ({ setFieldValue }) => {
    const [preview, setPreview] = useState(null);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      setFieldValue('image', file);
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
  
    return (
      <div className="w-full mx-auto p-4 border rounded shadow-md mt-5">
        <label className="block mb-2 text-sm font-medium text-gray-700">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        />
        {preview && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
            <img src={preview} alt="Preview" className="w-full h-auto rounded border" />
          </div>
        )}
      </div>
    );
  };
  

export default ImageUploaded;
