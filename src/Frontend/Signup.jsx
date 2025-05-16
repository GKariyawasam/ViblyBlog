import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Field, Formik, Form } from 'formik';
import { Validation } from '../Components/Validation'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const SignupUI = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-white'>
      <title>Signup</title>
      <div className='flex shadow-2xl'>
        <Formik
          initialValues={initialValues}
          validationSchema={Validation}
          onSubmit={(values, actions) => {
            axios.post('http://localhost:8081/api/register', values)
            .then(res => {
              toast.success('Registration successful');
              actions.resetForm();
            })
            .catch(err => {
              console.error(err);
              toast.error('Username or Email already exists');
            });
          }}
        >
        {({errors, touched}) => (
          <Form >
            <div className='w-[450px] h-[750px] flex-col relative items-center justify-center text-center p-20 gap-8 bg-gradient-to-tr from-green-400 to-white rounded-2xl opacity-95'>
              <h1 className='text-5xl font-serif py-3'>Vibly</h1>

              <div className='flex flex-col text-2xl text-left'>
                <label className='text-lg'>Username</label>
                <Field name='username' type='text' className='rounded-3xl p-1 border-2 outline-none text-base' placeholder='Enter Your Name'/>
                <div className='min-h-[16px]'>
                {errors.username && touched.username && (  <small className='text-xs text-center text-red-700'>{errors.username}</small>)}</div>
              </div>
              <div className='flex flex-col text-2xl text-left'>
                <label className='text-lg'>Email</label>
                <Field name='email' type='email' className='rounded-3xl p-1 border-2 outline-none text-base' placeholder='Enter Your Email'/>
                <div className='min-h-[16px]'>
                {errors.email && touched.email && (  <small className='text-xs text-center text-red-700'>{errors.email}</small>)}</div>
              </div>
              <div className='flex flex-col text-2xl text-left'>
                <label className='text-lg'>Password</label>
                <Field name='password' type='password' className='rounded-3xl p-1 border-2 outline-none text-base' placeholder='Enter Your Password'/>
                <div className='min-h-[16px]'>
                {errors.password && touched.password && (  <small className='text-xs text-center text-red-700'>{errors.password}</small>)}</div>
              </div>
              <div className='flex flex-col text-2xl text-left'>
                <label className='text-lg'>Confirm Password</label>
                <Field name='confirmPassword' type='password' className='rounded-3xl p-1 border-2 outline-none text-base' placeholder='Confirm Your Password'/>
                <div className='min-h-[16px]'>
                {errors.confirmPassword && touched.confirmPassword && (  <small className='text-xs text-center text-red-700'>{errors.confirmPassword}</small>)}</div>
              </div>
              <button className='w-full py-3 mt-8 bg-green-700 rounded-3xl text-white'>Sign Up</button>

              <div className='flex justify-between mt-4'>
                <p className='px-6 py-2 flex items-center'><FcGoogle className='mr-2' />Google</p>
                <p className='px-6 py-2 flex items-center'><FaFacebookSquare className='mr-2' />Facebook</p>
              </div>

              <p className='py-4'>Already a member? <Link to="/" className='text-black underline hover:text-green-900'>Sign In</Link></p>
            </div>
          </Form>
        )}
        </Formik>
      </div>
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

export default SignupUI;
