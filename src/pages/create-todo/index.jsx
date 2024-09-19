import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../api/axios_instance";
import AuthProvider from "../../auth/authProvider";
import { useNavigate } from "react-router-dom";

const fetchStatuses = async () => {
  const { data } = await axiosInstance({
    url: "/statuses",
    method: "GET",
  });

  return data;
};

const CreateTodo = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const statusesResponse = useQuery(["statuses"], fetchStatuses);
  const createTodoMutation = useMutation(
    ({ todo }) => {
      return axiosInstance({
        url: "/todos",
        method: "POST",
        data: todo,
      });
    },
    {
      onSuccess: () => {
        queryClient.resetQueries(["todo", "myTodo", "myTodos"]);
      },
    }
  );

  const [todo, setTodo] = useState({
    title: "",
    description: null,
    status: "",
  });
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (!statusesResponse.isLoading) {
      setTodo({
        ...todo,
        status: statusesResponse.data.data[0]._id,
      });
    }
  }, [statusesResponse.isLoading]);

  useEffect(() => {
    if (createTodoMutation.isSuccess) {
      navigate(`/todos/${createTodoMutation.data.data.data._id}`);
    }
  }, [createTodoMutation.isSuccess]);

  const handleCreate = (event) => {
    event.preventDefault();

    if (!todo.title) {
      setTitleError(true);
    }

    createTodoMutation.mutate({ todo });
  };

  return (
    <AuthProvider>
      {!statusesResponse.isLoading ? (
        <div className="container mx-auto px-3 py-7">
          <div className="mb-5 flex gap-4 items-center justify-start">
            <h1 className="text-xl ">Todo:</h1>
          </div>
          <form className="flex flex-col max-w-full sm:max-w-[30%] gap-5">
            <label className="flex flex-col">
              <p>Title:</p>
              <input
                className={`rounded p-2 border ${
                  titleError ? " border-2 border-red-600 outline-none" : ""
                }`}
                onChange={(event) => {
                  setTitleError(false);

                  setTodo({
                    ...todo,
                    title: event.target.value,
                  });
                }}
                value={todo.title}
                type="text"
                name="title"
              />
            </label>
            <label className="flex flex-col">
              <p>Description:</p>
              <textarea
                className="rounded p-2 border"
                rows={5}
                name="description"
                id="description"
                defaultValue={todo.description}
                onChange={(event) => {
                  setTodo({
                    ...todo,
                    description: event.target.value,
                  });
                }}
              ></textarea>
            </label>
            <select
              value={todo.status}
              onChange={(event) => {
                setTodo({
                  ...todo,
                  status: event.target.value,
                });
              }}
              required
              className="p-2 border"
              name="status"
              id="status"
            >
              {statusesResponse.data.data.map((el) => (
                <option key={el._id} value={el._id}>
                  {el.title}
                </option>
              ))}
            </select>
            <button onClick={handleCreate} className="border p-2" type="submit">
              Create
            </button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </AuthProvider>
  );
};

export default CreateTodo;
