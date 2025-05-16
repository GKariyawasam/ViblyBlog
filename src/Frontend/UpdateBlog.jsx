import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import Header from '../Components/Header';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import ImageUploaded from '../Components/ImageUploaded';

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [initialValues, setInitialValues] = useState(null);

  const config = useMemo(() => ({
    readonly: false,
    height: 400,
    uploader: { insertImageAsBase64URI: true },
    buttons: [
      'source', '|', 'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|', 'image', 'video', 'link', '|',
      'left', 'center', 'right', 'justify', '|', 'undo', 'redo'
    ],
    toolbarAdaptive: false,
    showXPathInStatusbar: false
  }), []);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    category: Yup.string().required('Category is required'),
  });

  useEffect(() => {
  axios.get(`http://localhost:8081/api/myblog/${id}`)
    .then(res => {
      console.log("Fetched blog:", res.data);

      const blog = res.data;

      setInitialValues({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        image: null,
        existingImage: blog.image,
      });
    })
    .catch(err => {
      console.error("Failed to fetch blog:", err);
      toast.error("Failed to load blog.");
    });
}, [id]);


  const handleUpdate = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('category', values.category);
      if (values.image) formData.append('image', values.image);

      const res = await axios.put(`http://localhost:8081/api/myblog/${id}`, formData);
      if (res.status === 200) {
        toast.success('Blog updated successfully!');
        setTimeout(() => navigate('/myblog'), 2000);
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Update failed.');
    }
  };

  if (!initialValues) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      <Header />
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
      >
        {({ values, setFieldValue }) => (
          <Form className="p-4 max-w-4xl mx-auto mt-12">
            <h1 className="text-2xl font-bold mb-4">Update Blog</h1>

            <Field name="title" type="text" className="w-full p-2 mb-4 border border-gray-300 rounded mt-6" />

            <Field as="select" name="category" className="w-full p-2 mb-4 border border-gray-300 rounded">
                <option value="" disabled>Select category</option>
                <option value="Life">Life Style</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food & Recipes</option>
                <option value="Tech">Technology</option>
                <option value="Fashion">Fashion & Beauty</option>
            </Field>
            <JoditEditor
              ref={editor}
              value={values.content}
              config={config}
              onBlur={(newContent) => setFieldValue('content', newContent)}
            />

            
            {values.existingImage && (
              <div className='my-4'>
                <p className='mb-1'>Current Image:</p>
                <img src={`http://localhost:8081/uploads/${values.existingImage}`} className="w-full h-[300px] object-cover rounded" />
              </div>
            )}

            <ImageUploaded setFieldValue={setFieldValue} />

            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
          </Form>
        )}
      </Formik>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default UpdateBlog;
