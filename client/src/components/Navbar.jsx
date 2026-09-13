import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="relative z-50 bg-gray-900 text-white px-4 sm:px-6 py-3">
      <div className="flex min-h-10 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center">
          <Link
            to={getHomePath()}
            onClick={closeMenu}
            className="shrink-0 text-xl font-bold"
          >
            ProcureHub
          </Link>

          {!user && (
            <div className="hidden items-center gap-6 pl-6 sm:flex">
              <Link to="/about" className="hover:underline">
                About
              </Link>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-5 sm:flex">
          {!user ? (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="text-right">
                <p className="font-semibold leading-tight">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-gray-400">
                  {getRoleLabel(user.role)}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded p-2 hover:bg-gray-800 sm:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gray-700 pb-2 pt-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {!user ? (
              <>
                <Link
                  to="/about"
                  onClick={closeMenu}
                  className="rounded px-3 py-3 hover:bg-gray-800"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="rounded px-3 py-3 hover:bg-gray-800"
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded px-3 py-3 hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded px-3 py-3 hover:bg-gray-800"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="border-b border-gray-700 px-3 py-3">
                  <p className="font-semibold">{user.name || "User"}</p>
                  <p className="text-sm text-gray-400">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full rounded bg-red-500 px-3 py-3 text-left font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;