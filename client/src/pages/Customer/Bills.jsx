import { useEffect, useState } from "react";
import axios from "../../utils/api";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CustomerBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingBillId, setPayingBillId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBills = async () => {
    try {
      const res = await axios.get("/bills/customer");
      setBills(res.data);
    } catch (err) {
      console.error("Error fetching customer bills:", err);
      setError("Failed to load your bills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handlePayment = async (bill) => {
    setError("");
    setSuccess("");
    setPayingBillId(bill._id);

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      const { data } = await axios.post(`/payments/bills/${bill._id}/order`);

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "ProcureHub",
        description: `Payment for request ${bill.request?.requestId || "N/A"}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await axios.post(`/payments/bills/${bill._id}/verify`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            setSuccess("Payment completed successfully.");
            await fetchBills();
          } catch (verificationError) {
            setError(
              verificationError.response?.data?.message ||
                "Payment was received but verification failed."
            );
          } finally {
            setPayingBillId(null);
          }
        },
        modal: {
          ondismiss: () => setPayingBillId(null),
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setError(response.error?.description || "Payment failed.");
        setPayingBillId(null);
      });
      razorpay.open();
    } catch (err) {
      console.error("Error starting payment:", err);
      setError(
        err.response?.data?.message || err.message || "Unable to start payment."
      );
      setPayingBillId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h2 className="mb-6 text-2xl font-bold">My Bills</h2>
        <p className="text-gray-500">Loading bills...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-6 text-2xl font-bold">My Bills</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {bills.length === 0 ? (
        <p className="text-gray-500">No bills generated yet.</p>
      ) : (
        <div className="space-y-4">
          {bills.map((bill) => {
            const isPaid = bill.paymentStatus === "paid";
            const isPaying = payingBillId === bill._id;

            return (
              <div
                key={bill._id}
                className="rounded-lg border bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Request ID</p>
                    <p className="font-semibold text-blue-600">
                      {bill.request?.requestId || "N/A"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isPaid ? "Paid" : "Payment Pending"}
                  </span>
                </div>

                <div className="space-y-2">
                  <p>
                    <strong>Vendor:</strong>{" "}
                    {bill.vendor?.organization || bill.vendor?.name || "N/A"}
                  </p>

                  <p>
                    <strong>Amount Payable:</strong>{" "}
                    <span className="text-lg font-semibold text-green-700">
                      ₹
                      {Number(bill.customerTotal || 0).toLocaleString("en-IN")}
                    </span>
                  </p>

                  <p className="text-sm text-gray-500">
                    <strong>Generated On:</strong>{" "}
                    {bill.generatedAt
                      ? new Date(bill.generatedAt).toLocaleDateString("en-IN")
                      : "N/A"}
                  </p>

                  {isPaid && bill.paidAt && (
                    <p className="text-sm text-gray-500">
                      <strong>Paid On:</strong>{" "}
                      {new Date(bill.paidAt).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>

                {!isPaid && (
                  <button
                    type="button"
                    onClick={() => handlePayment(bill)}
                    disabled={isPaying}
                    className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPaying ? "Opening Payment..." : "Pay Now"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerBills;
