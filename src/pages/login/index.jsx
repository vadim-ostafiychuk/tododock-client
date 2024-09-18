import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios_instance";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const mutation = useMutation((loginData) => {
    return axiosInstance({
      url: "/auth/login",
      method: "POST",
      data: loginData,
    });
  });

  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState("");
  const [customError, setCustomError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = (event) => {
    event.preventDefault();

    if (!email || !password) {
      if (!email) {
        setEmailError(true);
      }

      if (!password) {
        setPasswordError(true);
      }

      return;
    }

    const isValidEmail = emailRegex.test(email);

    if (!isValidEmail) {
      setEmailError(true);
    }

    mutation.mutate({ email, password });
  };

  const handleChangeInput = () => {
    setEmailError(false);
    setPasswordError(false);
    mutation.reset();
    setCustomError("");
  };

  useEffect(() => {
    if (mutation.isError) {
      if (
        mutation.error.response?.status === 403 &&
        mutation.error.response?.data?.code === "USER_NOT_LOGINED"
      ) {
        setCustomError("Email or password is wrong!");
      }
    }

    if (mutation.isSuccess && mutation.data?.data?.accessToken) {
      setToken(mutation.data.data.accessToken);

      if (token) {
        navigate("/");
      }
    }
  }, [mutation]);

  return (
    <div className="max-w-96 px-10 pt-10 pb-10 min-h-full mx-auto text-center border">
      <h1 className="text-lg">Login</h1>
      <form className="flex flex-col pt-5">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => {
            handleChangeInput();
            setEmail(event.target.value);
          }}
          placeholder="Enter your email..."
          className={`mb-5 rounded p-2 border ${
            emailError ? " border-2 border-red-600 outline-none" : ""
          }`}
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event) => {
            handleChangeInput();
            setPassword(event.target.value);
          }}
          placeholder="Enter your password..."
          className={`mb-5 rounded p-2 border ${
            passwordError ? " border-2 border-red-600 outline-none" : ""
          }`}
        />
        <button
          disabled={mutation.isLoading}
          onClick={handleLogin}
          className="border p-2"
          type="submit"
        >
          Login
        </button>
      </form>
      {customError && <p className="mt-2 text-red-600">{customError}</p>}
      <p className="pt-5">
        You dont have account?{" "}
        <Link to="/register" className="text-blue-800 underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
