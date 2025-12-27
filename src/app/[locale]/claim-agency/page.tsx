import { Metadata } from "next";
import {
    Shield,
    CheckCircle2,
    CreditCard,
    Wallet,
    Clock,
    BadgeCheck,
    Edit3,
    LayoutList,
    Star,
    Lock,
    Zap
} from "lucide-react";

export const metadata: Metadata = {
    title: "Claim Ownership of Your Agency Profile | TravelAgencies.World",
    description: "Activate full control and verification of your existing agency profile on TravelAgencies.World.",
};

export default function ClaimAgencyPage() {
    const STRIPE_LINK = "https://buy.stripe.com/eVqbJ2gj6bda0QCdiK7Vm08";
    const CRYPTO_WALLET = "0x73a447cdb23eb584e045dfe14bedafc2e86a1826";
    const REVOLUT_LINK = "https://revolut.me/itsmeussa";

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Main Content */}
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-6">
                            <BadgeCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            Claim Ownership of Your Agency Profile
                        </h1>
                        <p className="text-slate-600 text-base md:text-lg">
                            Your agency is already listed on TravelAgencies.World.<br className="hidden md:block" />
                            Activate full control and verification.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                            What you get
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Edit3 className="w-5 h-5 text-slate-700 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-slate-900">Edit and update all agency information</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <LayoutList className="w-5 h-5 text-slate-700 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-slate-900">Add services and travel experiences</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Star className="w-5 h-5 text-slate-700 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-slate-900">Appear as a Verified Agency with priority visibility</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-slate-900 rounded-2xl p-6 mb-6 text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">
                                Founding Offer
                            </span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-bold">€100</span>
                            <span className="text-slate-400">one-time payment</span>
                        </div>

                        <p className="text-slate-400 text-sm mb-4">
                            Limited to the first 200 agencies only.
                        </p>

                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                            <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-slate-300">
                                    After 200 agencies have claimed, ownership will be charged monthly.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3 mb-6">
                        {/* Stripe */}
                        <a
                            href={STRIPE_LINK}
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-center"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                <span>Pay €100 — Secure Checkout</span>
                            </div>
                            <p className="text-blue-200 text-xs mt-1">Card, Apple Pay, Google Pay</p>
                        </a>

                        {/* Revolut */}
                        <a
                            href={REVOLUT_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-center border border-slate-700"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Wallet className="w-5 h-5" />
                                <span>Pay via Revolut</span>
                            </div>
                            <p className="text-slate-400 text-xs mt-1">Instant bank transfer</p>
                        </a>

                        {/* Crypto */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <span className="text-orange-600 font-bold text-sm">₿</span>
                                </div>
                                <span className="font-semibold text-slate-900">Pay with Crypto</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                                Send €100 equivalent in ETH, USDT, or USDC to:
                            </p>
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <code className="text-xs text-slate-700 break-all font-mono">
                                    {CRYPTO_WALLET}
                                </code>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Email confirmation to contact@travelagencies.world after payment.
                            </p>
                        </div>
                    </div>

                    {/* Trust Signals */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-8">
                        <div className="flex items-center gap-1.5">
                            <Lock className="w-4 h-4" />
                            <span>Secure payment</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Immediate access</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4" />
                            <span>No hidden fees</span>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center">
                        <p className="text-sm text-slate-500">
                            If no action is taken, your agency profile will remain unclaimed and cannot be managed.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
