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
      return alert("Passwords must be up to 6 characters");
    }
    if (password !== password2) {
      return alert("Passwords do not match");
    }

    const userData = {
      password,
      password2,
    };

    try {
      const data = await resetUserPassword(userData, resetToken);
      if (data) {
        alert(data.message);
        navigate('/login');
      }
    } catch (error) {
      console.log('Failed to reset password');
    }
  };

  return (
    <div>
      <div>
        <div >
          <div className="--flex-center">
            <MdPassword size={35} color="#999" />
          </div>
          <h2>Reset Password</h2>

          <form onSubmit={reset}>
            <input
              type="password"
              placeholder="New Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
            />

            <button type="submit" className="--btn --btn-primary --btn-block">
              Reset Password
            </button>
            <div >
              <p>
                <Link to="/">- Home</Link>
              </p>
              <p>
                <Link to="/login">- Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
