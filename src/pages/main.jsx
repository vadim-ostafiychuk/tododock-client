import AuthProvider from "../auth/authProvider";
import MyTodos from "../components/my-todos";

const Main = () => {
  return (
    <AuthProvider>
      <div className="container mx-auto px-3">
        <MyTodos />
      </div>
    </AuthProvider>
  );
};

export default Main;
