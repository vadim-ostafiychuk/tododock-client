import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../api/axios_instance";
import AuthProvider from "../../auth/authProvider";
import { useNavigate } from "react-router-dom";

const fetchMe = async () => {
  return axiosInstance({
    url: "/users/me",
    method: "GET",
  });
};

const Account = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const meResponse = useQuery("me", fetchMe, {
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 0,
  });

  //   const createTodoMutation = useMutation(
  //     ({ todo }) => {
  //       return axiosInstance({
  //         url: "/todos",
  //         method: "POST",
  //         data: todo,
  //       });
  //     },
  //     {
  //       onSuccess: () => {
  //         queryClient.resetQueries(["todo", "myTodo", "myTodos"]);
  //       },
  //     }
  //   );

  const [user, setUser] = useState({
    firstName: null,
    lastName: null,
    email: null,
  });

  const [newPassword, setNewPassword] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);

  const [oldPassword, setOldPassword] = useState(null);
  const [oldPasswordError, setOldPasswordError] = useState(null);

  useEffect(() => {
    // if (!statusesResponse.isLoading) {
    //   setTodo({
    //     ...todo,
    //     status: statusesResponse.data.data[0]._id,
    //   });
    // }
  }, [meResponse.isLoading]);

  const handleCreate = (event) => {
    event.preventDefault();

    // if (!todo.title) {
    //   setTitleError(true);
    // }

    // createTodoMutation.mutate({ todo });
  };

  return (
    <AuthProvider>
      {!meResponse.isLoading ? (
        <div className="container mx-auto px-3 py-7 flex flex-col gap-5 justify-between">
          <div>
            <div className="mb-5 flex gap-4 items-center justify-start">
              <h1 className="text-xl ">Account:</h1>
            </div>
            <form className="flex flex-col max-w-full sm:max-w-[30%] gap-5">
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
                  value={user.firstName}
                  type="text"
                  name="title"
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
                  value={user.lastName}
                  type="text"
                  name="title"
                />
              </label>
              <label className="flex flex-col">
                <p>Email:</p>
                <input
                  className={`rounded p-2 border `}
                  onChange={(event) => {
                    setUser({
                      ...user,
                      email: event.target.value,
                    });
                  }}
                  value={user.email}
                  type="text"
                  name="title"
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
          </div>

          <div>
            <div className="mb-5 flex gap-4 items-center justify-start">
              <h1 className="text-xl ">Password:</h1>
            </div>
            <form className="flex flex-col max-w-full sm:max-w-[30%] gap-5">
              <label className="flex flex-col">
                <p>Old Password:</p>
                <input
                  className={`rounded p-2 border`}
                  onChange={(event) => {
                    setUser({
                      ...user,
                      firstName: event.target.value,
                    });
                  }}
                  value={user.firstName}
                  type="text"
                  name="title"
                />
              </label>
              <label className="flex flex-col">
                <p>New Password:</p>
                <input
                  className={`rounded p-2 border `}
                  onChange={(event) => {
                    setUser({
                      ...user,
                      lastName: event.target.value,
                    });
                  }}
                  value={user.lastName}
                  type="text"
                  name="title"
                />
              </label>
              <button
                onClick={handleCreate}
                className="border p-2"
                type="submit"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </AuthProvider>
  );
};

export default Account;
