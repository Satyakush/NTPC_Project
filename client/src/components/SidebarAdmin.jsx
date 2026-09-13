import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const SidebarAdmin = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = (path) =>
    `block rounded px-4 py-3 transition hover:bg-gray-800 ${
      location.pathname === path ? "bg-gray-800 font-semibold" : ""
    }`;

  return (
    <aside className="shrink-0">
      <div className="md:hidden">
        <button
          type="button"
          aria-label={isOpen ? "Close admin navigation" : "Open admin navigation"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="fixed left-4 top-[4.75rem] z-40 rounded-lg bg-gray-900 p-3 text-white shadow-lg"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {isOpen && (
          <>
            <button
              type="button"
              aria-label="Close admin navigation overlay"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 bg-black/40"
            />
            <div className="fixed left-0 top-0 z-40 h-full w-72 bg-gray-900 text-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-700 p-4 pt-20">
                <h1 className="text-xl font-bold">Admin</h1>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded p-2 hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1 px-2 py-4">
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className={linkClass("/admin/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/admin/approve" onClick={() => setIsOpen(false)} className={linkClass("/admin/approve")}>
                  Approve Users
                </Link>
                <Link to="/admin/requests" onClick={() => setIsOpen(false)} className={linkClass("/admin/requests")}>
                  Requests
                </Link>
                <Link to="/admin/quotes" onClick={() => setIsOpen(false)} className={linkClass("/admin/quotes")}>
                  Quotes
                </Link>
                <Link to="/admin/bills" onClick={() => setIsOpen(false)} className={linkClass("/admin/bills")}>
                  Bills
                </Link>
              </nav>
            </div>
          </>
        )}
      </div>

      <div className="hidden min-h-[calc(100vh-64px)] w-64 bg-gray-900 text-white md:flex md:flex-col">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h1 className="text-xl font-bold">Admin</h1>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
            Dashboard
          </Link>
          <Link to="/admin/approve" className={linkClass("/admin/approve")}>
            Approve Users
          </Link>
          <Link to="/admin/requests" className={linkClass("/admin/requests")}>
            Requests
          </Link>
          <Link to="/admin/quotes" className={linkClass("/admin/quotes")}>
            Quotes
          </Link>
          <Link to="/admin/bills" className={linkClass("/admin/bills")}>
            Bills
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default SidebarAdmin;