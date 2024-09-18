import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios_instance";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const mutation = useMutation((loginData) => {
    return axiosInstance({
      url: "/auth/register",
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

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [customError, setCustomError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/i;

  const handleRegister = (event) => {
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

      return;
    }

    const isValidPassword = passwordRegex.test(password);

    if (!isValidPassword) {
      setPasswordError(true);

      return;
    }

    mutation.mutate({ firstName, lastName, email, password });
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
        mutation.error.response?.status === 400 &&
        mutation.error.response?.data?.code === "USER_EXISTS"
      ) {
        setCustomError("Email exists!");
      }
    }

    if (mutation.isSuccess && mutation.data?.data?.accessToken) {
      setToken(mutation.data.data.accessToken);
      navigate("/");
    }
  }, [mutation]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[95%] sm:w-[70%] md:w-[50%] xl:w-[30%] max-w-xl px-10 pt-10 pb-10 min-h-full mx-auto text-center border">
        <h1 className="text-lg">Register</h1>
        <form className="flex flex-col pt-5">
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(event) => {
              handleChangeInput();
              setFirstName(event.target.value);
            }}
            placeholder="Enter your firstName..."
            className="mb-5 rounded p-2 border"
          />
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(event) => {
              handleChangeInput();
              setLastName(event.target.value);
            }}
            placeholder="Enter your lastName..."
            className="mb-5 rounded p-2 border"
          />
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
          <button onClick={handleRegister} className="border p-2" type="submit">
            Register
          </button>
        </form>
        {customError && <p className="mt-2 text-red-600">{customError}</p>}
        <p className="pt-5">
          You have account?{" "}
          <Link to="/login" className="text-blue-800 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
