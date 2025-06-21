import { Link } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";

export default function Navbar() {
  const { user, role, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <div>
        <Link to="/">Procurement</Link>
      </div>
      <div className="space-x-4">
        {!user && (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
        {user && role === "customer" && (
          <>
            <Link to="/customer/requests">My Requests</Link>
            <Link to="/customer/create-request">Create</Link>
            <Link to="/customer/bills">My Bills</Link>
          </>
        )}
        {user && role === "vendor" && (
          <>
            <Link to="/vendor/requests">Requests</Link>
            <Link to="/vendor/quotes">My Quotes</Link>
            <Link to="/vendor/bills">My Bills</Link>
          </>
        )}
        {user && role === "cooperative" && (
          <>
            <Link to="/admin/approve-users">Approve Users</Link>
            <Link to="/admin/publish-requests">Publish Requests</Link>
            <Link to="/admin/quotes">View Quotes</Link>
            <Link to="/admin/bills">All Bills</Link>
          </>
        )}
        {user && <button onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}
