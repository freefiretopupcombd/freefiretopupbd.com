"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginClient() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectPath = searchParams.get("redirect") || "/profile";

    useEffect(() => {
        // clear old session on login page
        localStorage.clear();
        sessionStorage.clear();
    }, []);

    // =========================
    // EMAIL/PASSWORD LOGIN
    // =========================
    const signIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/user_login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const result = await res.json();

            if (!res.ok || result.error) {
                setErrors([result.error || "Login failed"]);
                return;
            }

            localStorage.setItem("user-info", JSON.stringify(result));

            router.push(redirectPath);
        } catch (error) {
            setErrors(["Failed to login. Please try again."]);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // GOOGLE LOGIN REDIRECT
    // =========================
    const googleLogin = () => {
        setLoadingGoogle(true);
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 flex justify-center min-h-[70vh]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                    Welcome Back
                </h1>

                {/* Google Login */}
                <button
                    type="button"
                    onClick={googleLogin}
                    disabled={loadingGoogle}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70"
                >
                    {loadingGoogle ? "Connecting..." : "Continue with Google"}
                </button>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 text-gray-400 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        {errors.map((err, idx) => (
                            <p key={idx} className="text-red-600 text-sm text-center">
                                {err}
                            </p>
                        ))}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={signIn} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-xl shadow-md disabled:opacity-70"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Links */}
                <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
                    <p>
                        New Member?{" "}
                        <Link
                            href="/register"
                            className="text-pink-600 font-bold hover:underline"
                        >
                            Create account
                        </Link>
                    </p>

                    <p>
                        <Link
                            href="/forgot-password"
                            className="text-gray-500 hover:text-pink-600"
                        >
                            Forgot Password?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}