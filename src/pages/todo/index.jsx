import { Link, useParams } from "react-router-dom";
import AuthProvider from "../../auth/authProvider";
import axiosInstance from "../../api/axios_instance";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { DateTime } from "luxon";

const fetchMyTodo = (todoId) => {
  return axiosInstance({
    url: `/todos/${todoId}`,
  });
};

const Todo = () => {
  let { id } = useParams();

  const { isLoading, error, data } = useQuery(["myTodo"], () =>
    fetchMyTodo(id)
  );

  useEffect(() => {
    if (!isLoading) {
      console.log(data);
    }
  }, [isLoading]);

  return (
    <AuthProvider>
      {!isLoading ? (
        <div className="container px-2 py-10">
          <Link className="text-blue-800 underline" to="/">
            {"< "}Home page
          </Link>
          <h2>{data.data?.data.title}</h2>
          <span style={{ color: data.data?.data.status.color }}>
            {data.data?.data.status.title}
          </span>
          <p className="italic">{data.data?.data.description}</p>

          <p>
            <time>
              {DateTime.fromISO(data.data?.data.createdAt)
                .setLocale("en-US")
                .toLocaleString(DateTime.DATETIME_FULL)}
            </time>
          </p>
          <Link className="text-blue-800 underline" to={`/todos/${id}/edit`}>
            Edit Todo
          </Link>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </AuthProvider>
  );
};

export default Todo;
