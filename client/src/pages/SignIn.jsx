import React, { useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom'
import {
  signInStart,
  signInSuccess,
  signInFailure,
  forgotFailure
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({})

  // State selectors for loading and error messages
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handles form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Check if all fields are filled
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart())

      // API call for sign in
      const res = await fetch ('/api/auth/signin', {
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      })
      const data = await res.json()
      // Handle failure from server
      if (data.success === false) {
        dispatch(signInFailure(data.message))
      }
      // Navigate to home on success
      if(res.ok) {
        dispatch(signInSuccess(data))
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(data.message))
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* Left section with branding and information */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Carrey's</span> Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can  sign in with your email and password or with google.
          </p>
        </div>
        {/* Right section with sign in form */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='**********'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Forgot Password?</span>
            <Link to='/forgot' className='text-blue-500'>
              Forgot
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

