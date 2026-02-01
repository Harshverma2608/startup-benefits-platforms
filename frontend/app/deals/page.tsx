"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DealsPage() {
  const { token } = useAuth();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API_URL + "/deals").then((res) => {
      if (res.data.success) setDeals(res.data.data.deals || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function handleClaim(dealId: string) {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    axios.post(API_URL + "/claims", { dealId }, { headers: { Authorization: "Bearer " + token } })
      .then(() => alert("Claimed! Check dashboard."))
      .catch((err) => alert(err.response?.data?.message || "Could not claim"));
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Deals</h1>
      {deals.length === 0 ? (
        <p className="rounded-lg bg-gray-100 p-8 text-center text-gray-600">No deals right now.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <div key={deal._id} className="rounded-lg border bg-white p-4 shadow-sm">
              <h2 className="font-bold text-gray-900">{deal.title}</h2>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{deal.shortDescription || deal.description}</p>
              <p className="mt-2 text-xs text-gray-500">{deal.partnerName}</p>
              <span className="mt-2 inline-block rounded bg-indigo-100 px-2 py-0.5 text-sm font-medium text-indigo-700">{deal.discount}</span>
              <div className="mt-4 flex gap-2">
                <a href={deal.dealUrl} target="_blank" rel="noopener noreferrer" className="flex-1 rounded border border-indigo-600 py-2 text-center text-sm text-indigo-600 hover:bg-indigo-50">
                  View
                </a>
                <button
                  type="button"
                  onClick={() => handleClaim(deal._id)}
                  className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                >
                  Claim
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
