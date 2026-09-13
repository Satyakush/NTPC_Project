import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import SidebarAdmin from "./components/SidebarAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Landing/Home";
import About from "./pages/Landing/About";
import Contact from "./pages/Landing/Contact";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AdminDashboard from "./pages/Admin/Dashboard";
import ApproveUsers from "./pages/Admin/ApproveUsers";
import ManageRequests from "./pages/Admin/Requests";
import ManageQuotes from "./pages/Admin/Quotes";
import ManageBills from "./pages/Admin/Bills";

import CustomerDashboard from "./pages/Customer/Dashboard";
import CreateRequest from "./pages/Customer/CreateRequest";
import MyRequests from "./pages/Customer/MyRequests";
import QuotesReceived from "./pages/Customer/QuotesReceived";
import CustomerBills from "./pages/Customer/Bills";

import VendorDashboard from "./pages/Vendor/Dashboard";
import AvailableRequests from "./pages/Vendor/AvailableRequests";
import SubmitQuote from "./pages/Vendor/SubmitQuote";
import MyQuotes from "./pages/Vendor/MyQuotes";
import VendorBills from "./pages/Vendor/Bills";
import VendorProfile from "./pages/Vendor/Profile";

const AdminLayout = ({ children }) => (
  <div className="flex min-w-0">
    <SidebarAdmin />
    <main className="min-w-0 flex-1 p-4 sm:p-6">
      {children}
    </main>
  </div>
);

const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Home />;
  }

  switch (user.role) {
    case "customer":
      return <Navigate to="/customer/dashboard" replace />;
    case "vendor":
      return <Navigate to="/vendor/dashboard" replace />;
    case "cooperative":
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Home />;
  }
};

function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/dashboard" element={<ProtectedRoute role="cooperative"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/approve" element={<ProtectedRoute role="cooperative"><AdminLayout><ApproveUsers /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute role="cooperative"><AdminLayout><ManageRequests /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/quotes" element={<ProtectedRoute role="cooperative"><AdminLayout><ManageQuotes /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/bills" element={<ProtectedRoute role="cooperative"><AdminLayout><ManageBills /></AdminLayout></ProtectedRoute>} />

        <Route path="/customer/dashboard" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/create-request" element={<ProtectedRoute role="customer"><CreateRequest /></ProtectedRoute>} />
        <Route path="/customer/requests" element={<ProtectedRoute role="customer"><MyRequests /></ProtectedRoute>} />
        <Route path="/customer/quotes" element={<ProtectedRoute role="customer"><QuotesReceived /></ProtectedRoute>} />
        <Route path="/customer/bills" element={<ProtectedRoute role="customer"><CustomerBills /></ProtectedRoute>} />

        <Route path="/vendor/dashboard" element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>} />
        <Route path="/vendor/requests" element={<ProtectedRoute role="vendor"><AvailableRequests /></ProtectedRoute>} />
        <Route path="/vendor/submit-quote/:requestId" element={<ProtectedRoute role="vendor"><SubmitQuote /></ProtectedRoute>} />
        <Route path="/vendor/quotes" element={<ProtectedRoute role="vendor"><MyQuotes /></ProtectedRoute>} />
        <Route path="/vendor/bills" element={<ProtectedRoute role="vendor"><VendorBills /></ProtectedRoute>} />
        <Route path="/vendor/profile" element={<ProtectedRoute role="vendor"><VendorProfile /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;