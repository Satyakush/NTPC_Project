import { Link } from "react-router-dom";
import {
  PlusCircle,
  FileText,
  MessagesSquare,
  Receipt,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

const dashboardCards = [
  {
    title: "Create New Request",
    description:
      "Create a new procurement request and submit the items you need.",
    icon: PlusCircle,
    path: "/customer/create-request",
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "My Requests",
    description:
      "Track your submitted procurement requests and their current status.",
    icon: FileText,
    path: "/customer/requests",
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Quotes Received",
    description:
      "Review quotations submitted by vendors for your procurement requests.",
    icon: MessagesSquare,
    path: "/customer/quotes",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "My Bills",
    description:
      "View and track bills generated from your approved procurement.",
    icon: Receipt,
    path: "/customer/bills",
    gradient: "from-purple-500 to-violet-600",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const CustomerDashboard = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <ClipboardList className="w-7 h-7 text-indigo-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                Customer Portal
              </p>

              <h1 className="text-4xl font-bold text-slate-900">
                Customer Dashboard
              </h1>
            </div>
          </div>

          <p className="text-slate-500 text-lg ml-1">
            Manage your procurement requests, compare vendor quotes, and
            track your bills from one place.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Procurement
            </p>

            <p className="text-xl font-semibold text-slate-900 mt-1">
              Request Management
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Vendors
            </p>

            <p className="text-xl font-semibold text-slate-900 mt-1">
              Quote Comparison
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Finance
            </p>

            <p className="text-xl font-semibold text-slate-900 mt-1">
              Bill Tracking
            </p>
          </div>

        </div>

        {/* Operations */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Procurement Operations
          </h2>

          <p className="text-slate-500 mt-1">
            Manage your complete procurement lifecycle.
          </p>
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
                {/* Left Accent */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${card.gradient}`}
                />

                {/* Icon + Arrow */}
                <div className="flex items-start justify-between">

                  <div
                    className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center`}
                  >
                    <Icon
                      className={`w-7 h-7 ${card.iconColor}`}
                    />
                  </div>

                  <ArrowRight
                    className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
                  />

                </div>

                {/* Content */}
                <div className="mt-6">

                  <h3 className="text-xl font-bold text-slate-900">
                    {card.title}
                  </h3>

                  <p className="text-slate-500 mt-2 leading-relaxed">
                    {card.description}
                  </p>

                </div>

                {/* Action */}
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

export default CustomerDashboard;