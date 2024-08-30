import { Link } from "react-router-dom";

const TodoCard = () => {
  return (
    <div className="border-b py-4">
      <h2>Todo</h2>
      <span className="text-[#e80000]">Closed</span>
      <p className="italic">Description</p>

      <p>
        <time>20.09.2024</time>
      </p>
      <Link className="text-blue-800 underline" to="/todos/1">
        Open
      </Link>
    </div>
  );
};

export default TodoCard;
