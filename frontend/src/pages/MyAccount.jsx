import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";

function MyAccount() {
  return (
    
      
      <div className="col-span-9 p-4 rounded-lg">
        <Outlet />
      </div>
    
  );
}

export default MyAccount;
