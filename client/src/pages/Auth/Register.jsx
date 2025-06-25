import { useState } from "react";
import axios from "../../utils/api";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import successAnimation from "../../assets/success.json";
import bgImage from "../../assets/registering.jpg";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    note: "",
    organization: "",
    gstin: "",
    vendorItems: [{ name: "", description: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.vendorItems];
    updatedItems[index][field] = value;
    setForm({ ...form, vendorItems: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      vendorItems: [...form.vendorItems, { name: "", description: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.role !== "vendor") {
        delete payload.organization;
        delete payload.gstin;
        delete payload.vendorItems;
      }

      await axios.post("/auth/register", payload);
      setSuccess(true);
    } catch (err) {
      alert("Registration failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Player
          autoplay
          loop
          src={successAnimation}
          style={{ height: "300px" }}
        />
        <h2 className="text-2xl font-bold text-green-600 mt-4">
          Registration Successful!
        </h2>
        <p className="text-gray-600 text-center mt-2 px-4">
          Please wait for the cooperative to approve your account.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border px-3 py-2 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {form.role === "vendor" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  placeholder="Organization Name"
                  className="w-full border px-3 py-2 rounded"
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GSTIN
                </label>
                <input
                  type="text"
                  placeholder="GSTIN"
                  className="w-full border px-3 py-2 rounded"
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Items
                </label>
                {form.vendorItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Item Name"
                      className="w-1/2 border px-2 py-1 rounded"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(idx, "name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      className="w-1/2 border px-2 py-1 rounded"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(idx, "description", e.target.value)
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-2 text-blue-600 text-sm hover:underline"
                >
                  + Add More Items
                </button>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note for Admin (optional)
            </label>
            <textarea
              placeholder="Note for admin (optional)"
              rows={3}
              className="w-full border px-3 py-2 rounded"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold flex items-center justify-center gap-2 transition"
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
