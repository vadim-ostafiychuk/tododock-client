import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../api/axios_instance";
import AuthProvider from "../../auth/authProvider";

const fetchStatuses = async () => {
  const { data } = await axiosInstance({
    url: "/statuses",
    method: "GET",
  });

  return data;
};

const fetchTodo = async (id) => {
  const { data } = await axiosInstance({
    url: `/todos/${id}`,
    method: "GET",
  });

  return data;
};

const EditTodo = () => {
  const queryClient = useQueryClient();

  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState({
    title: "",
    description: "",
    status: "",
  });

  const [updated, setUpdated] = useState(false);

  const statusesResponse = useQuery(["statuses"], fetchStatuses);
  const todoResponse = useQuery(["todo"], () => fetchTodo(id), {
    cacheTime: 0,
  });

  const editTodoMutation = useMutation(
    ({ id, todo }) => {
      return axiosInstance({
        url: `/todos/${id}`,
        method: "PUT",
        data: todo,
      });
    },
    {
      onSuccess: () => {
        queryClient.resetQueries(["todo", "myTodo", "myTodos"]);
      },
    }
  );

  const deleteTodoMutation = useMutation(({ id }) => {
    return axiosInstance({
      url: `/todos/${id}`,
      method: "DELETE",
    });
  });

  const isLoading = statusesResponse.isLoading || todoResponse.isLoading;

  useEffect(() => {
    if (!isLoading) {
      setTodo({
        title: todoResponse.data.data?.title,
        description: todoResponse.data.data?.description,
        status: todoResponse.data.data.status?._id,
      });
    }
  }, [isLoading]);

  const handleOnClick = (event) => {
    event.preventDefault();

    editTodoMutation.mutate({ id, todo });
  };

  const handleDelete = () => {
    deleteTodoMutation.mutate({ id });
  };

  const handleChange = () => {
    editTodoMutation.reset();
    setUpdated(false);
  };

  useEffect(() => {
    if (editTodoMutation.isSuccess) {
      setUpdated(true);
    }
  }, [editTodoMutation.isSuccess]);

  useEffect(() => {
    if (deleteTodoMutation.isSuccess) {
      navigate("/");
    }
  }, [deleteTodoMutation.isSuccess]);

  return (
    <AuthProvider>
      {!isLoading ? (
        <div className="container mx-auto px-3 py-7">
          {updated ? <p className="text-[#0216f5]">Updated!</p> : ""}
          <div className="mb-5 flex flex-col sm:flex-row gap-4 items-center justify-start">
            <h1 className="text-xl ">
              Todo <b>{id}</b>
            </h1>
            <button onClick={handleDelete} className="text-blue-800 underline">
              Delete Todo
            </button>
          </div>
          <form className="flex flex-col max-w-full sm:max-w-[30%] gap-5">
            <label className="flex flex-col">
              <p>Title:</p>
              <input
                className="rounded p-2 border"
                onChange={(event) => {
                  handleChange();
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
                  handleChange();
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
                handleChange();
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
            <button
              onClick={handleOnClick}
              className="border p-2"
              type="submit"
            >
              Save
            </button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </AuthProvider>
  );
};

export default EditTodo;
