import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const SidebarAdmin = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const linkClass = (path) =>
    `block px-4 py-2 rounded hover:bg-gray-800 transition ${
      location.pathname === path
        ? "bg-gray-800 font-semibold"
        : ""
    }`;

  return (
    <div className="flex">
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } min-h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          {isOpen && (
            <h1 className="text-xl font-bold">
              Admin
            </h1>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover:text-gray-300 transition"
          >
            {isOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link
            to="/admin/dashboard"
            className={linkClass("/admin/dashboard")}
          >
            {isOpen ? "Dashboard" : "D"}
          </Link>

          <Link
            to="/admin/approve"
            className={linkClass("/admin/approve")}
          >
            {isOpen ? "Approve Users" : "A"}
          </Link>

          <Link
            to="/admin/requests"
            className={linkClass("/admin/requests")}
          >
            {isOpen ? "Requests" : "R"}
          </Link>

          <Link
            to="/admin/quotes"
            className={linkClass("/admin/quotes")}
          >
            {isOpen ? "Quotes" : "Q"}
          </Link>

          <Link
            to="/admin/bills"
            className={linkClass("/admin/bills")}
          >
            {isOpen ? "Bills" : "B"}
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default SidebarAdmin;