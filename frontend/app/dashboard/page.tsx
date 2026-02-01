"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      router.push("/deals");
      return;
    }
    axios.get(API_URL + "/claims/my-claims", { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        if (res.data.success) setClaims(res.data.data.claims || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, token, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  function getStatusStyle(s: string) {
    if (s === "approved") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    if (s === "expired") return "bg-gray-100 text-gray-700";
    return "bg-yellow-100 text-yellow-700";
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-3 text-xl font-semibold">Profile</h2>
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p>
            <span className="font-medium">Verified:</span>{" "}
            {user.isVerified ? <span className="text-green-600">Yes</span> : <span className="text-yellow-600">No</span>}
          </p>
        </div>

        <h2 className="mb-4 text-2xl font-bold">My claims</h2>
        {claims.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-gray-600">You have not claimed any deals yet.</p>
            <Link href="/deals" className="mt-4 inline-block rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
              Browse deals
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {claims.map((claim) => (
              <Link key={claim._id} href={"/deals/" + claim.deal?._id} className="block rounded-lg bg-white p-5 shadow hover:shadow-md">
                <h3 className="font-bold text-gray-900">{claim.deal?.title}</h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{claim.deal?.description}</p>
                <span className={"mt-2 inline-block rounded px-2 py-1 text-sm font-medium " + getStatusStyle(claim.status)}>
                  {claim.status}
                </span>
                <p className="mt-2 text-xs text-gray-500">Claimed: {new Date(claim.claimedAt).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
