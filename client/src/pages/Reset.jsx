import React, { useState } from "react";
import { MdPassword } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";

const initialState = {
  password: "",
  password2: "",
};

const Reset = () => {
  const [formData, setformData] = useState(initialState);
  const { password, password2 } = formData;
  const navigate = useNavigate();
  const location = useLocation();

  const { resetToken } = useParams();

  const resetUserPassword = async (userData, resetToken) => {
    try {
      const response = await axios.put(
        `/api/user/resetpassword/${resetToken}`,
        userData
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const reset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Passwords must be up to 6 characters");
    }
    if (password !== password2) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      password,
      password2,
    };

    try {
      const data = await resetUserPassword(userData, resetToken);
      if (data) {
        toast.success(data.message);
        navigate('/');
      }
    } catch (error) {
      console.log('Failed to reset password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-full max-w-md bg-white rounded shadow-lg p-8 m-4 w-fit">
        <div className="flex justify-center flex-col items-center mb-6">
          <div className="--flex-center">
            <MdPassword size={35} color="#999" />
          </div>
          <h2 className="text-center text-2xl text-gray-700 mb-4">Reset Password</h2>

          <form onSubmit={reset} className="flex flex-col justify-center w-full">
            <input
              type="password"
              placeholder="New Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
              className=" block border border-grey-light w-full p-3 rounded mb-4"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
              className=" block border border-grey-light w-full p-3 rounded mb-4"
            />

            <button type="submit" className=" text-center py-3 rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  text-white focus:outline-none my-1">
              Reset Password
            </button>
            <div className="justify-around text-center text-sm text-grey-dark mt-4 flex ">
              <p>
                <Link to="/" className="no-underline border-b border-grey-dark text-grey-dark">- Home</Link>
              </p>
              <p>
                <Link to="/login" className="no-underline border-b border-grey-dark text-grey-dark">- Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
