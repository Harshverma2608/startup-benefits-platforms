import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-3xl font-bold">Startup Benefits</h1>
      <p className="mb-6 text-gray-600">Deals for startups. Sign up and claim offers.</p>
      <div className="flex gap-3">
        <Link href="/deals" className="rounded bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700">
          See deals
        </Link>
        <Link href="/register" className="rounded border border-indigo-600 px-5 py-2 font-medium text-indigo-600 hover:bg-indigo-50">
          Sign up
        </Link>
      </div>
    </div>
  );
}
