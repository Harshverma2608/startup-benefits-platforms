"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-bold text-indigo-600">
          Startup Benefits
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/deals"
            className={`rounded px-2 py-1 text-sm ${pathname === "/deals" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Deals
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`rounded px-2 py-1 text-sm ${pathname === "/dashboard" ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Dashboard
              </Link>
              <span className="text-sm text-gray-500">{user.name}</span>
              <button onClick={logout} className="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100">
                Login
              </Link>
              <Link href="/register" className="rounded bg-indigo-600 px-2 py-1 text-sm text-white hover:bg-indigo-700">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
