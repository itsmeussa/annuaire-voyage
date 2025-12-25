"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User, UserPlus } from "lucide-react";

export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const [referralCode, setReferralCode] = useState("");
    const [referralError, setReferralError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setReferralError(null);
        setMessage(null);

        try {
            // 1. Verify Referral Code
            if (!referralCode) {
                setReferralError("Referral code is required");
                setLoading(false);
                return;
            }

            const { data: isValid, error: rpcError } = await supabase.rpc('check_referral_code', { code: referralCode });

            if (rpcError) {
                // If RPC fails (e.g., function not found because SQL wasn't run), we might want to fail gracefully or strict
                // For now, strict:
                console.error("Referral check failed:", rpcError);
                throw new Error("Unable to verify referral code. System update required.");
            }

            if (!isValid) {
                setReferralError("Invalid referral code");
                setLoading(false);
                return;
            }

            // 2. Proceed with Signup
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                    data: {
                        full_name: fullName,
                        referred_by: referralCode,
                        // We pass the valid code here. The trigger will double-check or just use it.
                        // Ideally, we treat the 'check' above as UX, and let the trigger handle security.
                    }
                },
            });

            if (error) {
                throw error;
            }

            setMessage("Account created! Please check your email to confirm your account.");
            setFullName("");
            setEmail("");
            setPassword("");
            setReferralCode("");
        } catch (err: any) {
            setError(err.message || "Failed to sign up");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="text-center mb-8 pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                    <UserPlus className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-500 mt-2 text-sm">
                    Join our community of travelers and agencies
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="w-1 h-1 rounded-full bg-red-600" />
                    {error}
                </div>
            )}

            {message && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="w-1 h-1 rounded-full bg-green-600" />
                    {message}
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSignup}>

                {/* Full Name Field */}
                <div className="space-y-2">
                    <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <User className="h-5 w-5" />
                        </div>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            required
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                        />
                    </div>
                </div>

                {/* Referral Code Field */}
                <div className="space-y-2">
                    <label
                        htmlFor="referralCode"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Referral Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <span className="font-mono text-xs">REF</span>
                        </div>
                        <input
                            id="referralCode"
                            name="referralCode"
                            type="text"
                            required
                            placeholder="Ex: JOHN-X82A"
                            value={referralCode}
                            onChange={(e) => {
                                setReferralCode(e.target.value.toUpperCase());
                                setReferralError(null);
                            }}
                            className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all bg-gray-50 focus:bg-white ${referralError
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-200 focus:border-primary focus:ring-primary/20"
                                }`}
                        />
                    </div>
                    {referralError && (
                        <p className="text-xs text-red-600 mt-1 ml-1">{referralError}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Mail className="h-5 w-5" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Lock className="h-5 w-5" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            placeholder="••••••••"
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Creating Account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
