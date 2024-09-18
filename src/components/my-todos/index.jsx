import { useEffect, useRef, useState } from "react";
import TodoCard from "../todo-card";
import axiosInstance from "../../api/axios_instance";
import { useQuery } from "react-query";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";

const fetchMyTodods = async (page) => {
  const { data } = await axiosInstance({
    url: `todos/my/?limit=10&page=${page}`,
    method: "GET",
  });

  return data;
};

const MyTodos = () => {
  const myRef = useRef(null);

  const executeScroll = () => myRef.current?.scrollIntoView?.();

  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(+searchParams.get("page") || 1);
  const { isLoading, error, data } = useQuery(
    ["myTodos", page],
    () => fetchMyTodods(page),
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (page > 1) {
      setSearchParams({ page: page });
    } else {
      searchParams.delete("page");
      setSearchParams(searchParams);
    }

    executeScroll();
  }, [page]);

  // const handleOnPageClick = (event) => {
  //   console.log(page);
  // };

  const handleOnPageChange = (event) => {
    // console.log(event);

    const page = event.selected + 1;

    // if (page === 1) {

    // }

    // setSearchParams({ page: page });

    setPage(page);
  };

  return (
    <div className="py-5" ref={myRef}>
      <h1 className="text-2xl">My todos:</h1>
      <div className="flex flex-col gap-3">
        {error ? (
          <div>Error: {error.message}</div>
        ) : isLoading ? (
          <div>Loading...</div>
        ) : (
          data.data.map((todo) => <TodoCard key={todo._id} todo={todo} />)
        )}
      </div>
      {!isLoading && (
        <div className="p-2">
          <p>Count: {data.meta.count}</p>
          <ReactPaginate
            className="flex gap-2"
            pageLinkClassName="hover:underline text-blue-800"
            activeLinkClassName="underline"
            breakLabel="..."
            nextLabel=">"
            initialPage={page - 1}
            onPageChange={handleOnPageChange}
            // onClick={handleOnPageClick}
            pageRangeDisplayed={5}
            pageCount={data.meta.pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        </div>
      )}
    </div>
  );
};

export default MyTodos;
