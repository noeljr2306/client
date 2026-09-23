"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiRequest from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const DASHBOARD_BY_ROLE = {
  SHIPPER: "/dashboard/shipper",
  FORWARDER: "/dashboard/forwarder",
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    tenantName: "",
    tenantType: "SHIPPER",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: form,
      });
      login(data.token, data.user);
      router.push(DASHBOARD_BY_ROLE[data.user.role]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6">Create an account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Company / Organization name
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.tenantName}
            onChange={(e) => update("tenantName", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Account type</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.tenantType}
            onChange={(e) => update("tenantType", e.target.value)}
          >
            <option value="SHIPPER">Shipper</option>
            <option value="FORWARDER">Forwarder</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white rounded py-2 font-medium disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600">
          Log in
        </Link>
      </p>
    </main>
  );
}
