import Link from "next/link";
import { Metadata } from "next";
import {
    Rocket,
    Target,
    BarChart3,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    Globe2,
    Users2
} from "lucide-react";
import CTASection from "@/components/ui/CTASection";

export const metadata: Metadata = {
    title: "List Your Travel Agency - Get More Clients | TravelAgencies.World",
    description: "Join 2670+ travel agencies. List your agency for free, improve your online visibility, and get direct leads from travelers planning their next trip.",
    keywords: ["list travel agency", "b2b travel marketing", "travel agency directory", "get travel leads", "promote tour operator"],
};

export default function ForAgenciesPage() {
    const benefits = [
        {
            icon: <Globe2 className="w-6 h-6 text-primary" />,
            title: "Enhanced Visibility",
            description: "Get discovered by travelers thousands of times per month searching for agencies in your city."
        },
        {
            icon: <Target className="w-6 h-6 text-primary" />,
            title: "High-Quality Leads",
            description: "Connect with serious travelers who are actively planning trips and looking for experts like you."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-primary" />,
            title: "Build Trust",
            description: "Showcase your Verified status, Google reviews, and expertise to stand out from competitors."
        },
        {
            icon: <BarChart3 className="w-6 h-6 text-primary" />,
            title: "Performance Insights",
            description: "Track how many travelers view your profile and contact you directly."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />

                <div className="container relative z-10 px-4 mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm animate-fade-in-down">
                        <Rocket className="w-4 h-4" />
                        <span className="text-sm font-medium text-white">Join 2,670+ Smart Agencies</span>
                    </div>

                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl animate-fade-in-up">
                        Grow Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Travel Business</span>
                    </h1>

                    <p className="max-w-2xl mx-auto mb-10 text-lg text-slate-300 md:text-xl animate-fade-in-up delay-100">
                        Claim your free profile, manage your reputation, and connect with millions of travelers planning their next adventure.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row justify-center animate-fade-in-up delay-200">
                        <Link
                            href="/auth/signup"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all bg-primary rounded-xl hover:bg-primary/90 hover:scale-105 shadow-xl shadow-primary/25"
                        >
                            List My Agency for Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link
                            href="/agencies"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700"
                        >
                            View Directory
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-b border-slate-100">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
                        {[
                            { label: "Monthly Visitors", value: "50k+" },
                            { label: "Active Agencies", value: "2,600+" },
                            { label: "Cities Covered", value: "300+" },
                            { label: "Leads Generated", value: "10k+" },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Value Proposition */}
            <section className="py-24 bg-slate-50">
                <div className="container px-4 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why List Your Agency?</h2>
                        <p className="text-lg text-slate-600">Travelers trust verified directories. Being listed on TravelAgencies.World puts your brand in front of customers right when they are ready to book.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works for Agencies */}
            <section className="py-24 bg-white">
                <div className="container px-4 mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Simple 3-Step Process</h2>
                            <div className="space-y-8">
                                {[
                                    {
                                        title: "Create Your Account",
                                        desc: "Sign up in seconds. It's completely free and no credit card is required."
                                    },
                                    {
                                        title: "Claim or Add Agency",
                                        desc: "Find your agency in our database to claim it, or add a new listing if it doesn't exist."
                                    },
                                    {
                                        title: "Start Receiving Leads",
                                        desc: "Optimize your profile with photos and services. Travelers will contact you directly."
                                    }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                            <p className="text-slate-600">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10">
                                <Link href="/auth/signup" className="text-primary font-bold hover:underline inline-flex items-center">
                                    Get Started Now <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>

                        {/* Visual Representation (Mockup) */}
                        <div className="relative">
                            <div className="relative z-10 bg-slate-900 rounded-2xl p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                {/* Mock Profile Card */}
                                <div className="bg-white rounded-xl p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Users2 className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                                            <div className="h-3 w-24 bg-slate-100 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-3 w-full bg-slate-100 rounded"></div>
                                        <div className="h-3 w-full bg-slate-100 rounded"></div>
                                        <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
                                    </div>
                                    <div className="mt-6 flex gap-3">
                                        <div className="h-10 flex-1 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">Claim Profile</div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative background blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-200 to-rose-200 rounded-full blur-3xl opacity-30 -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA to close */}
            <CTASection
                title="Ready to Scale Your Agency?"
                subtitle="Join the fastest growing network of travel professionals today."
                primaryAction={{ label: "List My Agency Now", href: "/auth/signup" }}
            />
        </div>
    );
}
