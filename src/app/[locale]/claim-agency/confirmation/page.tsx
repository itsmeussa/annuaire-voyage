import { Link } from "@/navigation";
import { Metadata } from "next";
import {
    CheckCircle2,
    ArrowRight,
    Mail,
    Shield,
    Clock,
    Sparkles
} from "lucide-react";

export const metadata: Metadata = {
    title: "Payment Confirmed | TravelAgencies.World",
    description: "Your agency ownership claim has been successfully processed.",
};

export default function PaymentConfirmationPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full py-16">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                        Payment Confirmed
                    </h1>

                    <p className="text-slate-600">
                        Your agency ownership has been successfully claimed.
                    </p>
                </div>

                {/* Confirmation Details */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                        What happens next
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Mail className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Check your email</p>
                                <p className="text-sm text-slate-500">
                                    You will receive a confirmation email with access details.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Account verification</p>
                                <p className="text-sm text-slate-500">
                                    Your agency profile will be marked as verified within 24 hours.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Full access granted</p>
                                <p className="text-sm text-slate-500">
                                    Edit your profile, add services, and manage your listing.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Founding Member Badge */}
                <div className="bg-slate-900 rounded-2xl p-5 mb-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full mb-3">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-400">Founding Agency</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                        You are now a founding member with lifetime access at no recurring fees.
                    </p>
                </div>

                {/* Processing Time Note */}
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-8">
                    <Clock className="w-4 h-4" />
                    <span>Processing time: up to 24 hours</span>
                </div>

                {/* CTA */}
                <div className="space-y-3">
                    <Link
                        href="/account"
                        className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                    >
                        <span>Go to Your Dashboard</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/agencies"
                        className="flex items-center justify-center w-full text-slate-600 hover:text-slate-900 font-medium py-3 transition-colors"
                    >
                        Browse Agency Directory
                    </Link>
                </div>

                {/* Support Note */}
                <div className="text-center mt-8">
                    <p className="text-sm text-slate-500">
                        Questions? Contact us at{" "}
                        <a href="mailto:contact@travelagencies.world" className="text-slate-700 underline">
                            contact@travelagencies.world
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
