import { useAuth } from "../../context/AuthContext.jsx";
import {
  UserCircle,
  Mail,
  ShieldCheck,
  CalendarDays,
  Building2,
  BadgeCheck,
} from "lucide-react";

const VendorProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-8 py-6">
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const registeredDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
            Account Management
          </p>

          <h1 className="text-4xl font-bold text-slate-900 mt-1">
            Vendor Profile
          </h1>

          <p className="text-slate-500 mt-2">
            View your ProcureHub vendor account information.
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
              <UserCircle className="w-14 h-14 text-white" />
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-bold">
                {user.name || "Vendor"}
              </h2>

              <p className="text-blue-100 mt-1">
                {user.email || "Email not available"}
              </p>

              <div className="flex justify-center md:justify-start mt-4">
                <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-2 rounded-full text-sm">
                  <BadgeCheck className="w-4 h-4" />
                  Verified Vendor Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-8 py-6 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-900">
              Account Information
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Your registered vendor details
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Name */}
            <div className="p-7 border-b md:border-r border-slate-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <UserCircle className="w-5 h-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Full Name
                  </p>

                  <p className="font-semibold text-slate-900 mt-1">
                    {user.name || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="p-7 border-b border-slate-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Email Address
                  </p>

                  <p className="font-semibold text-slate-900 mt-1 break-all">
                    {user.email || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="p-7 md:border-r border-slate-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Account Role
                  </p>

                  <p className="font-semibold text-slate-900 mt-1 capitalize">
                    {user.role || "Vendor"}
                  </p>
                </div>
              </div>
            </div>

            {/* Registration */}
            <div className="p-7">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <CalendarDays className="w-5 h-5 text-emerald-600" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Registered On
                  </p>

                  <p className="font-semibold text-slate-900 mt-1">
                    {registeredDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Status */}
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Building2 className="w-6 h-6 text-emerald-600" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Vendor Account Status
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Your account is currently active and ready for procurement
                activities.
              </p>
            </div>

            <span className="ml-auto hidden sm:inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;