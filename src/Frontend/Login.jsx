import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { LoginValidation } from '../Components/Validation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex items-center justify-center bg-white'>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginValidation}
        onSubmit={async (values, actions) => {
          try {
            const { username, password } = values;

            const res = await axios.post("http://localhost:8081/api/login", { username, password });
            const { isAdmin, userId, username: returnedUsername, email } = res.data;

             if (isAdmin) {
              localStorage.setItem("isAdmin", "true");
              toast.success("Admin Login Successful");
              setTimeout(() => {
                navigate("/admin");
              }, 900);
            } else {
              localStorage.setItem("isAdmin", "false");
              localStorage.setItem("userId", userId);
              localStorage.setItem("username", username);
              localStorage.setItem("email", email);

              toast.success("Login Successful");
              setTimeout(() => {
                navigate("/home");
              }, 900);
            }
          } catch (error) {
            if(error.response?.status == 401){
              toast.error("Invalid username or password");
              actions.setFieldError("username", "Invalid username or password");
            }else{
              alert("Server Error")
            }
            
          }
        }}
      >

        {({ errors, touched }) => (
          <Form className='flex shadow-2xl'>
            <div className='w-[450px] h-[700px] flex-col relative items-center justify-center text-center p-20 gap-8 bg-gradient-to-tr from-green-400 to-white rounded-2xl opacity-95'>
              <h1 className='text-5xl font-serif py-9'>Vibly</h1>

              <div className='flex flex-col text-2xl text-left'>
                <label className='text-lg'>Username</label>
                <Field name='username' type='text' className='rounded-3xl p-1 border-2 outline-none text-base' />
                <div className='min-h-[24px] text-left'>
                  {errors.username && touched.username && (
                    <small className='text-xs text-center text-red-700'>{errors.username}</small>
                  )}
                </div>
              </div>

              <div className='flex flex-col text-2xl text-left'>
                <label className='text-lg'>Password</label>
                <Field name='password' type='password' className='rounded-3xl p-1 border-2 outline-none text-base'/>
                <div className='min-h-[24px] text-left'>
                  {errors.password && touched.password && (
                    <small className='text-xs text-center text-red-700'>{errors.password}</small>
                  )}
                </div>
              </div>

              <button type='submit' className='w-full py-3 mt-8 bg-green-700 rounded-3xl text-white'>
                Sign In
              </button>

              <div className='flex justify-between mt-4'>
                <p className='px-6 py-2 flex items-center'><FcGoogle className='mr-2' />Google</p>
                <p className='px-6 py-2 flex items-center'><FaFacebookSquare className='mr-2' />Facebook</p>
              </div>

              <p className='py-4'>
                Not a member? <Link to="/signup" className='text-black underline hover:text-green-900'>Sign Up</Link>
              </p>
            </div>
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

export default Login;
