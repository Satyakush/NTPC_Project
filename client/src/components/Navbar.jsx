import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/auth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="text-xl font-bold tracking-wide">NTPC-ISTORE</div>

        <div className="flex flex-wrap gap-4 items-center text-sm">
          {user ? (
            <>
              {user.role === "customer" && (
                <>
                  <Link to="/customer/requests" className="hover:text-blue-300">My Requests</Link>
                  <Link to="/customer/create-request" className="hover:text-blue-300">Create Request</Link>
                  <Link to="/customer/bills" className="hover:text-blue-300">My Bills</Link>
                </>
              )}

              {user.role === "vendor" && (
                <>
                  <Link to="/vendor/requests" className="hover:text-blue-300">Published Requests</Link>
                  <Link to="/vendor/quotes" className="hover:text-blue-300">My Quotes</Link>
                  <Link to="/vendor/bills" className="hover:text-blue-300">My Bills</Link>
                </>
              )}

              {user.role === "cooperative" && (
                <>
                  <Link to="/admin/approve-users" className="hover:text-blue-300">Approve Users</Link>
                  <Link to="/admin/publish-requests" className="hover:text-blue-300">Publish Requests</Link>
                  <Link to="/admin/quotes" className="hover:text-blue-300">Quotes</Link>
                  <Link to="/admin/bills" className="hover:text-blue-300">Bills</Link>
                </>
              )}

              <button
                onClick={logout}
                className="ml-4 bg-white text-blue-900 px-3 py-1 rounded hover:bg-blue-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300">Login</Link>
              <Link to="/register" className="hover:text-blue-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
