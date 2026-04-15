"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);
    setMessage("");

    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot_password`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await result.json();

      if (data.error) {
        setErrors(Array.isArray(data.error) ? data.error : [data.error]);
      } else {
        setMessage(data.message || "Password reset link sent to your email.");
      }

    } catch (error) {
      setErrors(["An error occurred. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 relative overflow-hidden">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-center mb-4">
          Forgot Password
        </h2>

        {errors.length > 0 && (
          <div className="bg-red-100 p-3 mb-4">
            {errors.map((e, i) => <p key={i}>{e}</p>)}
          </div>
        )}

        {message && (
          <div className="bg-green-100 p-3 mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full border p-3 rounded"
          />

          <button
            disabled={isLoading}
            className="w-full bg-pink-500 text-white p-3 rounded"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/login">Back to Login</Link>
        </div>

      </div>
    </div>
  );
}