import GoogleIcon from "../assets/images/google.webp";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "../utils/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useState } from "react";
import { useEffect } from "react";

export default function Login() {
  const { error, loading, fetchData } = useFetch();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const otp_accesss = sessionStorage.getItem("otp_access");
    if (otp_accesss) {
      navigate("/otp-verification");
    }
  });

  //Check if the user already have session if true then redirect into dashboard
  useEffect(() => {}, []);

  const handleManualLogin = async () => {
    try {
      const data = await fetchData("super-admin/auth/login", {
        method: "POST",
        data: { email },
      });
      console.log(data);
      navigate("/otp-verification");
      sessionStorage.setItem("otp_access", "true");
      sessionStorage.setItem("otp_type", "login");
      sessionStorage.setItem("email", email);
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  //Google login
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { access_token } = response;
        const data = await fetchData("/super-admin/auth/google", {
          method: "POST",
          data: { access_token, type: "login" },
        });
        console.log(data);
        navigate("/otp-verification");
        sessionStorage.setItem("otp_access", "true");
        sessionStorage.setItem("otp_type", "login");
        sessionStorage.setItem("email", data.email);
      } catch (error) {
        console.log(error);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className='min-h-screen w-full text-sm text-gray-900 bg-white flex flex-col gap-5 items-center justify-center'>
      <div className='flex flex-col gap-3 items-center mb-5'>
        <h1 className='font-bold text-3xl'>Sign In</h1>
        <h2>to continue to your Super Admin Account.</h2>
      </div>
      <div className='flex flex-col gap-5 w-[450px]'>
        <div className='flex flex-col gap-1'>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='p-4 rounded-lg ring ring-gray-400 hover:ring-2 hover:ring-blue-400 focus:ring-2 focus:ring-blue-400 outline-none w-full'
            placeholder='Enter email address'
          />
          {(error === "All fields must be filled" ||
            error === "Wrong credentials! Please try again.") && (
            <p className='text-xs text-red-500'>{error}</p>
          )}
        </div>
        <button
          onClick={handleManualLogin}
          disabled={loading}
          className={`${
            !loading ? "bg-violet-500" : "bg-gray-400"
          } rounded-lg hover:bg-violet-400 duration-75 p-4 text-white`}
        >
          {loading ? "Verifying" : "Continue"}
        </button>
        <div className='border-t relative border-gray-400 w-full'>
          <p className='px-4 absolute bg-white text-gray-400 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
            OR
          </p>
        </div>
        <div className='flex flex-col gap-1'>
          <button
            onClick={() => login()}
            disabled={loading}
            className={`${
              loading ? "text-gray-400 border-gray-200" : ""
            } p-4 rounded-lg border border-gray-400 flex items-center justify-center gap-3`}
          >
            {!loading && (
              <img
                src={GoogleIcon}
                alt='Google Icon'
                className='object-contain h-5 w-5'
              />
            )}
            <p>{loading ? "Verifying" : "Continue with Google"}</p>
          </button>
          {error !== "All fields must be filled" &&
            error !== "Wrong credentials! Please try again." && (
              <p className='text-xs text-red-500'>{error}</p>
            )}
        </div>
        <div className='text-center text-gray-400 mt-5 flex flex-col gap-3'>
          <p>
            Don't you have an account?{" "}
            <Link className='hover:underline text-purple-500' to='/sign-up'>
              Sign up
            </Link>
          </p>
          <p>
            Can't sign in?{" "}
            <Link
              className='hover:underline text-purple-500'
              to='/account-problem'
            >
              Go here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
