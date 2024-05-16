import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
    forgotFailure,forgotSuccess
  } from '../redux/user/userSlice';
  import { useDispatch } from 'react-redux';
  import Modal from '../components/Modal'


export default function Forgot()  {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post('api/user/forgotpassword', { email });
        setModalContent('Reset Email Sent');
        setModalOpen(true);
      } catch (error) {
        console.error(error);
        setModalContent('Email not sent, please try again');
        setModalOpen(true);
      }
    };
   
  


  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="p-6 bg-white rounded shadow-md w-1/3">
        <div className="flex justify-center items-center mb-4">
          <div className="--flex-center">
            <AiOutlineMail size={35} color="#4F46E5" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-center">Forgot Password</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button type="submit" className="w-full py-2 mb-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600">
              Get Reset Email
            </button>
            <div className="flex justify-between text-sm text-gray-600">
              <p>
                <Link to="/" className="hover:text-indigo-500">- Home</Link>
              </p>
              <p>
                <Link to="/sign-in" className="hover:text-indigo-500">- Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold">{modalContent}</h2>
      </Modal>
    </div>
  );
};