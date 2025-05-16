import * as Yup from 'yup'

export const Validation = Yup.object({
    username: Yup.string().min(3).required("*Please Enter Name"),
    email: Yup.string()
    .email("*Please Enter Valid Email")
    .required("*Please Enter Email")
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "*please enter valid email"),
    password: Yup.string()
    .min(8)
    .required("Please Enter Password")
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Password not matched')
})

export const LoginValidation = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });