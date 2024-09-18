import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import AuthProvider from "../auth/authProvider";

const Layout = () => {
  return (
    <main className="flex flex-col min-h-screen justify-between">
      <Header />
      <section className="grow">
        <Outlet />
      </section>
      <Footer />
    </main>
  );
};

export default Layout;
