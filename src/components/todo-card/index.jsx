import { Link } from "react-router-dom";
import { DateTime } from "luxon";

const TodoCard = ({ todo }) => {
  return (
    <div className="border-b py-4 px-2">
      <h2>{todo.title}</h2>
      <span style={{ color: todo.status.color }}>{todo.status.title}</span>
      <p className="italic">{todo.description}</p>

      <p>
        <time>
          {DateTime.fromISO(todo.createdAt)
            .setLocale("en-US")
            .toLocaleString(DateTime.DATETIME_FULL)}
        </time>
      </p>
      <Link className="text-blue-800 underline" to={`/todos/${todo._id}`}>
        Open
      </Link>
    </div>
  );
};

export default TodoCard;
