// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/auth";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Auth components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// Customer components
import MyRequests from "./components/Customer/MyRequests";
import CreateRequest from "./components/Customer/CreateRequest";
import CustomerMyBills from "./components/Customer/MyBills";

// Vendor components
import PublishedRequests from "./components/Vendor/PublishedRequests";
import SubmitQuote from "./components/Vendor/SubmitQuote";
import MyQuotes from "./components/Vendor/MyQuotes";
import MyBills from "./components/Vendor/MyBills";

// Admin components
import ApproveUsers from "./components/Admin/ApproveUsers";
import PublishRequests from "./components/Admin/PublishRequests";
import ViewQuotes from "./components/Admin/ViewQuotes";
import ViewBills from "./components/Admin/ViewBills";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<h1>Welcome to Procurement App</h1>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Customer Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
              <Route path="/customer/requests" element={<MyRequests />} />
              <Route
                path="/customer/create-request"
                element={<CreateRequest />}
              />
              <Route path="/customer/bills" element={<CustomerMyBills />} />
            </Route>

            {/* Vendor Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={["vendor"]} />}>
              <Route path="/vendor/requests" element={<PublishedRequests />} />
              <Route
                path="/vendor/submit-quote/:requestId"
                element={<SubmitQuote />}
              />
              <Route path="/vendor/quotes" element={<MyQuotes />} />
              <Route path="/vendor/bills" element={<MyBills />} />
            </Route>

            {/* Admin (Cooperative) Protected Routes */}
            <Route element={<PrivateRoute allowedRoles={["cooperative"]} />}>
              <Route path="/admin/approve-users" element={<ApproveUsers />} />
              <Route
                path="/admin/publish-requests"
                element={<PublishRequests />}
              />
              <Route path="/admin/quotes" element={<ViewQuotes />} />
              <Route path="/admin/bills" element={<ViewBills />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
