import React from 'react'
import {useSelector} from 'react-redux'
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';

export default function DashProfile() {
    const {currentUser,error,loading} = useSelector(state=>state.user)
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
        <form 
            // onSubmit={handleSubmit} 
            className='flex flex-col gap-4'
        >
            <div
                className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
                //   onClick={() => filePickerRef.current.click()}
                >
                {/* {imageFileUploadProgress && (
                    <CircularProgressbar
                    value={imageFileUploadProgress || 0}
                    text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                        root: {
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        },
                        path: {
                        stroke: `rgba(62, 152, 199, ${
                            imageFileUploadProgress / 100
                        })`,
                        },
                    }}
                    />
                )} */}
                <img
                    src={
                        // imageFileUrl || 
                        currentUser.profilePicture
                    }
                    alt='user'
                    className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                    //   imageFileUploadProgress &&
                    //   imageFileUploadProgress < 100 &&
                    'opacity-60'
                    }`}
                />
            </div>
            {/* {imageFileUploadError && (
                <Alert color='failure'>{imageFileUploadError}</Alert>
            )} */}
            <TextInput
                type='text'
                id='username'
                placeholder='username'
                defaultValue={currentUser.username}
                // onChange={handleChange}
            />
                <TextInput
                type='email'
                id='email'
                placeholder='email'
                defaultValue={currentUser.email}
                // onChange={handleChange}
            />
                <TextInput
                type='password'
                id='password'
                placeholder='password'
                // onChange={handleChange}
            />
            <Button
                type='submit'
                gradientDuoTone='purpleToBlue'
                outline
                // disabled={loading || imageFileUploading}
                >
                {loading ? 'Loading...' : 'Update'}
            </Button>
            {currentUser.isAdmin && (
                <Link to={'/create-post'}>
                    <Button
                    type='button'
                    gradientDuoTone='purpleToPink'
                    className='w-full'
                    >
                    Create a post
                    </Button>
                </Link>
            )}
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span 
                // onClick={() => setShowModal(true)} 
                className='cursor-pointer'
            >
                Delete Account
            </span>
            <span 
                // onClick={handleSignout} 
                className='cursor-pointer'
            >
                Sign Out
            </span>
        </div>
    </div>

  )
}
