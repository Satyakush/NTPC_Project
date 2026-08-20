import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleLabel = (role) => {
    if (role === "cooperative") return "Administrator";
    if (role === "customer") return "Customer";
    if (role === "vendor") return "Vendor";
    return "User";
  };

  const getHomePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "cooperative":
        return "/admin/dashboard";
      case "customer":
        return "/customer/dashboard";
      case "vendor":
        return "/vendor/dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      {/* Brand + Public Navigation */}
      <div className="flex items-center space-x-6">
        <Link
          to={getHomePath()}
          className="text-xl font-bold"
        >
          ProcureHub
        </Link>

        {/* Only show public navigation when logged out */}
        {!user && (
          <>
            <Link
              to="/about"
              className="hover:underline"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="hover:underline"
            >
              Contact
            </Link>
          </>
        )}
      </div>

      {/* Authentication / User Information */}
      <div className="flex items-center gap-5">
        {!user ? (
          <>
            <Link
              to="/login"
              className="hover:underline"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="hover:underline"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {/* Current Logged-in User */}
            <div className="text-right">
              <p className="font-semibold">
                {user.name || "User"}
              </p>

              <p className="text-xs text-gray-400">
                {getRoleLabel(user.role)}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;