import { Link } from "react-router-dom";
import { PlusCircle, FileText, MessagesSquare, Receipt, ArrowRight, ClipboardList } from "lucide-react";

const dashboardCards = [
  { title: "Create New Request", description: "Create a new procurement request and submit the items you need.", icon: PlusCircle, path: "/customer/create-request", gradient: "from-blue-500 to-indigo-600", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { title: "My Requests", description: "Track your submitted procurement requests and their current status.", icon: FileText, path: "/customer/requests", gradient: "from-emerald-500 to-teal-600", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  { title: "Quotes Received", description: "Review quotations submitted by vendors for your procurement requests.", icon: MessagesSquare, path: "/customer/quotes", gradient: "from-amber-500 to-orange-600", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { title: "My Bills", description: "View and track bills generated from your approved procurement.", icon: Receipt, path: "/customer/bills", gradient: "from-purple-500 to-violet-600", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
];

const CustomerDashboard = () => (
  <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 sm:mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="shrink-0 rounded-xl bg-indigo-100 p-2.5 sm:p-3">
            <ClipboardList className="h-6 w-6 text-indigo-600 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-indigo-600 sm:text-sm">Customer Portal</p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Customer Dashboard</h1>
          </div>
        </div>
        <p className="text-base leading-relaxed text-slate-500 sm:text-lg">Manage your procurement requests, compare vendor quotes, and track your bills from one place.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><p className="text-sm text-slate-500">Procurement</p><p className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">Request Management</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><p className="text-sm text-slate-500">Vendors</p><p className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">Quote Comparison</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><p className="text-sm text-slate-500">Finance</p><p className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">Bill Tracking</p></div>
      </div>

      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Procurement Operations</h2>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">Manage your complete procurement lifecycle.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} to={card.path} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
              <div className={`absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b ${card.gradient}`} />
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${card.iconBg}`}><Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${card.iconColor}`} /></div>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-indigo-600" />
              </div>
              <div className="mt-5 sm:mt-6"><h3 className="text-lg font-bold text-slate-900 sm:text-xl">{card.title}</h3><p className="mt-2 leading-relaxed text-slate-500">{card.description}</p></div>
              <div className="mt-5 text-sm font-semibold text-indigo-600 sm:mt-6">Open section →</div>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
);

export default CustomerDashboard;