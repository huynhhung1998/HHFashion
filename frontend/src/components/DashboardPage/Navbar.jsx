import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Users", path: "/users" },
    { name: "Stores", path: "/stores" },
    { name: "Products", path: "/products" },
    { name: "Transactions", path: "/transactions" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <nav className="flex items-center justify-between bg-white shadow px-6 py-3">
      {/* Logo / Title */}
      <div className="text-xl font-bold text-gray-700">
        <Link to="/">Admin Dashboard</Link>
      </div>

      {/* Menu */}
      <div className="flex space-x-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-700 font-medium">Admin User</span>
        <img
          src="https://ui-avatars.com/api/?name=Admin+User"
          alt="Admin"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </nav>
  );
};

export default Navbar;
