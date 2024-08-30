import TodoCard from "../todo-card";

const MyTodos = () => {
  return (
    <div className="py-5">
      <h1 className="text-2xl">My todos:</h1>
      <div className="flex flex-col gap-3">
        <TodoCard />
      </div>
    </div>
  );
};

export default MyTodos;
