import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileSchema = Yup.object().shape({
  F_Name: Yup.string().required('First name is required'),
  L_Name: Yup.string().required('Last name is required'),
  dob: Yup.date().required('Date of birth is required'),
  address: Yup.string().required('Address is required'),
  profilePicture: Yup.mixed().nullable(),
});

const ProfileModal = ({ isOpen, onClose }) => {
  const registerid = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  const initialValues = {
    F_Name: '',
    L_Name: '',
    dob: '',
    address: '',
    profilePicture: null,
  };

  const handleSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append('F_Name', values.F_Name);
      formData.append('L_Name', values.L_Name);
      formData.append('dob', values.dob);
      formData.append('address', values.address);
      formData.append('profile_picture', values.profilePicture);
      formData.append('registerid', registerid);

      const response = await axios.post('http://localhost:8081/api/author', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        const { profilePicture } = response.data;
        localStorage.setItem("profile_picture", profilePicture);

        window.dispatchEvent(new Event("profilePictureUpdated"));

        toast.success('Profile Created!');
        actions.resetForm();
        setPreview(null);
        onClose();
      } else {
        toast.error(`Error: ${response.data?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to create profile.');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-baseline mt-15 ml-340 ">

      <div className="fixed top-14 right-5 bg-white rounded-xl shadow-lg w-[450px] max-h-[90vh] overflow-y-auto border-1 p-6 z-50">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-red-500"
        >
          ✖
        </button>
        <h1 className="text-3xl font-bold text-center mb-4">Create Profile</h1>
        <p className="text-sm text-center mb-4 text-gray-600">
          Logged in as <strong>{username}</strong> ({email})
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form className="flex flex-col gap-2">
              <label>First Name</label>
              <Field name="F_Name" className="p-2 border rounded" />
              {errors.F_Name && touched.F_Name && <div className="text-red-500 text-sm">{errors.F_Name}</div>}

              <label>Last Name</label>
              <Field name="L_Name" className="p-2 border rounded" />
              {errors.L_Name && touched.L_Name && <div className="text-red-500 text-sm">{errors.L_Name}</div>}

              <label>Date of Birth</label>
              <Field type="date" name="dob" className="p-2 border rounded" />
              {errors.dob && touched.dob && <div className="text-red-500 text-sm">{errors.dob}</div>}

              <label>Address</label>
              <Field name="address" className="p-2 border rounded" />
              {errors.address && touched.address && <div className="text-red-500 text-sm">{errors.address}</div>}

              <label>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFieldValue('profilePicture', file);
                    const reader = new FileReader();
                    reader.onloadend = () => setPreview(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
                className="p-2 border rounded"
              />

              {preview && (
                <img src={preview} alt="Preview" className="w-20 h-20 mt-2 mx-auto rounded-full object-cover" />
              )}

              <button type="submit" className="mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Save Profile
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfileModal;
