import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";

function MyAccount() {
  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-3 bg-blue-200 p-4 rounded-lg">
        <Sidebar />
      </div>
      <div className="col-span-9 p-4 rounded-lg">
        <Outlet />
      </div>
    </div>
  );
}

export default MyAccount;
