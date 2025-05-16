import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import Header from '../Components/Header';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import ImageUploaded from '../Components/ImageUploaded';

const Blog = () => {
  const editor = useRef(null);
  const registerid = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const config = useMemo(() => ({
    readonly: false,
    height: 400,
    uploader: {
      insertImageAsBase64URI: true,
    },
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'image', 'video', 'link', '|',
      'left', 'center', 'right', 'justify', '|',
      'undo', 'redo'
    ],
    toolbarAdaptive: false,
    showXPathInStatusbar: false
  }), []);

  const initialValues = {
    title: '',
    content: '',
    category: '',
    image: null,
  };
  

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    category: Yup.string().required('Category is required'),
  });

  const handleSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('category', values.category);
      formData.append('image', values.image);
      formData.append('registerid', registerid);
  
      const response = await axios.post('http://localhost:8081/api/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      if (response.status === 200) {
        toast.success('Blog post submitted successfully!');
        actions.resetForm();
      } else {
        toast.error(`Error: ${response.data?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit blog post.');
    }
  };  
  

  return (
    <div>
      <Header />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="p-4 max-w-4xl mx-auto mt-12">
            <h1 className="text-2xl font-bold mb-4">Create Your Blog</h1>

            <Field
              name="title"
              type="text"
              placeholder="Enter Blog Title"
              className="w-full p-2 mb-4 border border-gray-300 rounded mt-6"
            />

            <Field
              as="select"
              name="category"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            >
              <option value="" label="Select Your Blog Category" />
              <option value="Life" label="Life Style" />
              <option value="Travel" label="Travel" />
              <option value="Food" label="Food & Recipes" />
              <option value="Tech" label="Technology" />
              <option value="Fashion" label="Fashion & Beauty" />
            </Field>

            <JoditEditor
              ref={editor}
              value={values.content}
              config={config}
              onBlur={(newContent) => setFieldValue('content', newContent)}
            />
            
            <ImageUploaded setFieldValue={setFieldValue} />

            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Post
            </button>
          </Form>
        )}
      </Formik>
      <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
            />
    </div>
  );
};

export default Blog;
