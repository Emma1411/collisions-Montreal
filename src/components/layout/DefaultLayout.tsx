
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function DefaultLayout() {
  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default DefaultLayout;
