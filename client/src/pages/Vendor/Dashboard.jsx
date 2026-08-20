import { Link } from "react-router-dom";
import {
  FileSearch,
  FileText,
  Receipt,
  UserCircle,
  ArrowRight,
  PackageSearch,
} from "lucide-react";

const dashboardCards = [
  {
    title: "Available Requests",
    description: "Browse procurement requests available for your quotations.",
    icon: PackageSearch,
    path: "/vendor/requests",
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "My Submitted Quotes",
    description: "Track quotations you have submitted to customers.",
    icon: FileText,
    path: "/vendor/quotes",
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Approved Bills",
    description: "View bills generated from your approved quotations.",
    icon: Receipt,
    path: "/vendor/bills",
    gradient: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "My Profile",
    description: "View your vendor account and registration details.",
    icon: UserCircle,
    path: "/vendor/profile",
    gradient: "from-orange-500 to-amber-600",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

const VendorDashboard = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <FileSearch className="w-7 h-7 text-indigo-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                Vendor Portal
              </p>

              <h1 className="text-4xl font-bold text-slate-900">
                Vendor Dashboard
              </h1>
            </div>
          </div>

          <p className="text-slate-500 text-lg ml-1">
            Manage procurement opportunities, quotations, bills, and your
            vendor account.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">Portal</p>
            <p className="text-xl font-semibold text-slate-900 mt-1">
              Vendor Workspace
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">Procurement</p>
            <p className="text-xl font-semibold text-slate-900 mt-1">
              Request & Quote
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">Account</p>
            <p className="text-xl font-semibold text-slate-900 mt-1">
              Active Vendor
            </p>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Vendor Operations
            </h2>

            <p className="text-slate-500 mt-1">
              Access your procurement activities from one place.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.path}
                className="group relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gradient accent */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${card.gradient}`}
                />

                <div className="flex items-start justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center`}
                  >
                    <Icon className={`w-7 h-7 ${card.iconColor}`} />
                  </div>

                  <ArrowRight
                    className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
                  />
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {card.title}
                  </h3>

                  <p className="text-slate-500 mt-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 text-sm font-semibold text-indigo-600">
                  Open section →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;