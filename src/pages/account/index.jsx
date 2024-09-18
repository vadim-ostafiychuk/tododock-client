import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import axiosInstance from "../../api/axios_instance";
import AuthProvider from "../../auth/authProvider";

const fetchMe = async () => {
  return axiosInstance({
    url: "/users/me",
    method: "GET",
  });
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Account = () => {
  const meResponse = useQuery("me", fetchMe, {
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 0,
  });

  const editMeMutation = useMutation(({ userData }) => {
    return axiosInstance({
      url: `/users/me`,
      method: "PATCH",
      data: userData,
    });
  });

  const changePasswordMutation = useMutation(({ data }) => {
    return axiosInstance({
      url: `/users/me/change-password`,
      method: "PATCH",
      data: data,
    });
  });

  const [user, setUser] = useState({
    firstName: null,
    lastName: null,
    email: null,
  });

  const [changed, setChanged] = useState(false);
  const [updated, setUpdated] = useState(false);

  const [emailError, setEmailError] = useState(false);

  const [newPassword, setNewPassword] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");

  const [customError, setCustomError] = useState("");
  const [customPasswordError, setCustomPasswordError] = useState("");

  useEffect(() => {
    if (!meResponse.isLoading) {
      setUser({
        firstName: meResponse.data.data.user.firstName,
        lastName: meResponse.data.data.user.lastName,
        email: meResponse.data.data.user.email,
      });
    }
  }, [meResponse.isLoading]);

  const handleCreate = (event) => {
    event.preventDefault();

    if (
      user.email !== meResponse.data.data.user.email &&
      !emailRegex.test(user.email)
    ) {
      setEmailError(true);

      return;
    }

    editMeMutation.mutate({ userData: user });
  };

  useEffect(() => {
    if (editMeMutation.isSuccess) {
      setUpdated(true);
    }
  }, [editMeMutation.isSuccess]);

  const handleChangePassword = (event) => {
    event.preventDefault();

    if (!oldPassword || !newPassword) {
      if (!oldPassword) {
        setOldPasswordError(true);
      }

      if (!newPassword) {
        setNewPasswordError(true);
      }
      return;
    }

    if (!newPassword) {
      setNewPasswordError(true);

      return;
    }

    changePasswordMutation.mutate({
      data: {
        oldPassword,
        newPassword,
      },
    });
  };

  useEffect(() => {
    if (
      changePasswordMutation.isError &&
      changePasswordMutation.error.response.data.code ===
        "INVALID_OLD_PASSWORD" &&
      changePasswordMutation.error.response.status === 403
    ) {
      setCustomPasswordError("Please enter correct old password!");
    }

    if (changePasswordMutation.isSuccess) {
      setChanged(true);
    }
  }, [changePasswordMutation.isError, changePasswordMutation.isSuccess]);

  useEffect(() => {
    if (editMeMutation.isError) {
      if (
        editMeMutation.error.response.status === 403 &&
        editMeMutation.error.response.data.code === "EMAIL_EXISTS"
      ) {
        setCustomError("Email exists!");
      }
    }
  }, [editMeMutation.isError]);

  return (
    <AuthProvider>
      {!meResponse.isLoading ? (
        <div className="container mx-auto px-3 py-7 flex flex-col gap-5 justify-between">
          <div>
            <div className="mb-5 flex gap-4 items-center justify-start">
              <h1 className="text-xl ">Account:</h1>
            </div>
            {updated ? <p className="text-[#0216f5]">Updated!</p> : ""}
            <form
              onChange={() => {
                setCustomError("");

                if (editMeMutation.isSuccess || editMeMutation.isError) {
                  editMeMutation.reset();
                }
                setUpdated(false);
              }}
              className="flex flex-col max-w-full sm:max-w-[30%] gap-5"
            >
              <label className="flex flex-col">
                <p>FirstName:</p>
                <input
                  className={`rounded p-2 border`}
                  onChange={(event) => {
                    setUser({
                      ...user,
                      firstName: event.target.value,
                    });
                  }}
                  value={user.firstName || ""}
                  type="text"
                  name="firstName"
                />
              </label>
              <label className="flex flex-col">
                <p>LastName:</p>
                <input
                  className={`rounded p-2 border `}
                  onChange={(event) => {
                    setUser({
                      ...user,
                      lastName: event.target.value,
                    });
                  }}
                  value={user.lastName || ""}
                  type="text"
                  name="lastName"
                />
              </label>
              <label className="flex flex-col">
                <p>Email:</p>
                <input
                  className={`mb-5 rounded p-2 border ${
                    emailError ? " border-2 border-red-600 outline-none" : ""
                  }`}
                  onChange={(event) => {
                    setEmailError(false);

                    setUser({
                      ...user,
                      email: event.target.value,
                    });
                  }}
                  value={user.email || ""}
                  type="email"
                  name="email"
                />
              </label>
              <button
                onClick={handleCreate}
                className="border p-2"
                type="submit"
              >
                Save
              </button>
            </form>
            {customError && <p className="mt-2 text-red-600">{customError}</p>}
          </div>

          <div>
            <div className="mb-5 flex gap-4 items-center justify-start">
              <h1 className="text-xl ">Password:</h1>
            </div>
            {changed ? <p className="text-[#0216f5]">Changed!</p> : ""}
            <form
              onChange={() => {
                setCustomPasswordError("");
                if (
                  changePasswordMutation.isSuccess ||
                  changePasswordMutation.isError
                ) {
                  changePasswordMutation.reset();
                }
                setChanged(false);
              }}
              className="flex flex-col max-w-full sm:max-w-[30%] gap-5"
            >
              <label className="flex flex-col">
                <p>Old Password:</p>
                <input
                  className={`mb-5 rounded p-2 border ${
                    oldPasswordError
                      ? " border-2 border-red-600 outline-none"
                      : ""
                  }`}
                  onChange={(event) => {
                    setOldPasswordError(false);
                    setOldPassword(event.target.value);
                  }}
                  type="password"
                  name="oldPassword"
                />
              </label>
              <label className="flex flex-col">
                <p>New Password:</p>
                <input
                  className={`mb-5 rounded p-2 border ${
                    newPasswordError
                      ? " border-2 border-red-600 outline-none"
                      : ""
                  }`}
                  onChange={(event) => {
                    setNewPasswordError(false);
                    setNewPassword(event.target.value);
                  }}
                  type="password"
                  name="newPassword"
                />
              </label>
              <button
                onClick={handleChangePassword}
                className="border p-2"
                type="submit"
              >
                Change Password
              </button>
            </form>
            {customPasswordError && (
              <p className="mt-2 text-red-600">{customPasswordError}</p>
            )}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </AuthProvider>
  );
};

export default Account;
