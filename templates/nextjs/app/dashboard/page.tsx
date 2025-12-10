import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">This is a protected page example.</p>

      <Link href="/" className="text-blue-500 hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  );
}
