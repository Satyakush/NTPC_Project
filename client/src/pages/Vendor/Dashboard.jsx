import { Link } from "react-router-dom";
import { FileSearch, FileText, Receipt, UserCircle, ArrowRight, PackageSearch } from "lucide-react";

const dashboardCards = [
  { title: "Available Requests", description: "Browse procurement requests available for your quotations.", icon: PackageSearch, path: "/vendor/requests", gradient: "from-blue-500 to-indigo-600", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { title: "My Submitted Quotes", description: "Track quotations you have submitted to customers.", icon: FileText, path: "/vendor/quotes", gradient: "from-emerald-500 to-teal-600", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  { title: "Approved Bills", description: "View bills generated from your approved quotations.", icon: Receipt, path: "/vendor/bills", gradient: "from-purple-500 to-violet-600", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  { title: "My Profile", description: "View your vendor account and registration details.", icon: UserCircle, path: "/vendor/profile", gradient: "from-orange-500 to-amber-600", iconBg: "bg-orange-100", iconColor: "text-orange-600" },
];

const VendorDashboard = () => (
  <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 sm:mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="shrink-0 rounded-xl bg-indigo-100 p-2.5 sm:p-3"><FileSearch className="h-6 w-6 text-indigo-600 sm:h-7 sm:w-7" /></div>
          <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wider text-indigo-600 sm:text-sm">Vendor Portal</p><h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Vendor Dashboard</h1></div>
        </div>
        <p className="text-base leading-relaxed text-slate-500 sm:text-lg">Manage procurement opportunities, quotations, bills, and your vendor account.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><p className="text-sm text-slate-500">Portal</p><p className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">Vendor Workspace</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><p className="text-sm text-slate-500">Procurement</p><p className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">Request & Quote</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><p className="text-sm text-slate-500">Account</p><p className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">Active Vendor</p></div>
      </div>

      <div className="mb-5"><h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Vendor Operations</h2><p className="mt-1 text-sm text-slate-500 sm:text-base">Access your procurement activities from one place.</p></div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} to={card.path} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
              <div className={`absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b ${card.gradient}`} />
              <div className="flex items-start justify-between gap-4"><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${card.iconBg}`}><Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${card.iconColor}`} /></div><ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-indigo-600" /></div>
              <div className="mt-5 sm:mt-6"><h3 className="text-lg font-bold text-slate-900 sm:text-xl">{card.title}</h3><p className="mt-2 leading-relaxed text-slate-500">{card.description}</p></div>
              <div className="mt-5 text-sm font-semibold text-indigo-600 sm:mt-6">Open section →</div>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
);

export default VendorDashboard;