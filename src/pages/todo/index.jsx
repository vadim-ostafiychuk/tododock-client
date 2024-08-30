import { Link } from "react-router-dom";

const Todo = () => {
  return (
    <div className="container px-2 pt-10">
      <Link className="text-blue-800 underline" to="/">
        {"< "}Home page
      </Link>
      <h2>Todo</h2>
      <span className="text-[#e80000]">Closed</span>
      <p className="italic">Description</p>

      <p>
        <time>20.09.2024</time>
      </p>
    </div>
  );
};

export default Todo;
