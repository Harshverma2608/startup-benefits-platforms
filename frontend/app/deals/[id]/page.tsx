"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DealDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { token } = useAuth();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios.get(API_URL + "/deals/" + id)
      .then((res) => {
        if (res.data.success) setDeal(res.data.data.deal);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  function handleClaim() {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setClaiming(true);
    axios.post(API_URL + "/claims", { dealId: id }, { headers: { Authorization: "Bearer " + token } })
      .then(() => alert("Claimed! Check dashboard."))
      .catch((err) => alert(err.response?.data?.message || "Could not claim"))
      .finally(() => setClaiming(false));
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-gray-600">Deal not found.</p>
        <Link href="/deals" className="mt-4 inline-block text-indigo-600 hover:underline">Back to deals</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/deals" className="mb-6 inline-block text-sm text-indigo-600 hover:underline">← Back to deals</Link>
      <h1 className="mb-4 text-3xl font-bold text-gray-900">{deal.title}</h1>
      <p className="mb-2 text-sm text-gray-500">Partner: {deal.partnerName}</p>
      <span className="inline-block rounded bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-700">{deal.discount}</span>
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-2 font-semibold text-gray-900">Description</h2>
        <p className="text-gray-600">{deal.description}</p>
        {deal.eligibilityConditions && (
          <>
            <h2 className="mt-4 mb-2 font-semibold text-gray-900">Eligibility</h2>
            <p className="text-gray-600">{deal.eligibilityConditions}</p>
          </>
        )}
        <div className="mt-6 flex gap-3">
          <a href={deal.dealUrl} target="_blank" rel="noopener noreferrer" className="rounded border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50">
            View offer
          </a>
          <button
            type="button"
            onClick={handleClaim}
            disabled={claiming}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {claiming ? "Claiming..." : "Claim deal"}
          </button>
        </div>
      </div>
    </div>
  );
}
