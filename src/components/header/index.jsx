import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Header = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((store) => store.logout);

  const handleOnLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container px-3 py-3 border-b-2 flex flex-col sm:flex-row justify-between max-w-full">
      <Link className="text-2xl" to={"/"}>
        TODO<b>DOCK</b>
      </Link>
      <ul className="flex items-center gap-2">
        <li className="">
          <Link className="text-blue-800 hover:underline" to={`/`}>
            Home
          </Link>
        </li>
        <li>
          <Link className="text-blue-800 hover:underline" to={`/create-todo`}>
            Create Todo
          </Link>
        </li>
        <li>
          <Link className="text-blue-800 hover:underline" to={`/account`}>
            My Account
          </Link>
        </li>
        <li>
          <button
            onClick={handleOnLogout}
            className="text-blue-800 hover:underline"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Header;
