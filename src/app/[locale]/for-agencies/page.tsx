import { Link } from "@/navigation";
import { Metadata } from "next";
import {
    Rocket,
    Target,
    BarChart3,
    ShieldCheck,
    ArrowRight,
    Globe2,
    Users2,
    CheckCircle2,
    TrendingUp,
    Building2,
    Star
} from "lucide-react";
import CTASection from "@/components/ui/CTASection";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: 'ForAgencies' });

    return {
        title: t('hero.title') + " " + t('hero.titleHighlight') + " | " + "TravelAgencies.World",
        description: t('hero.subtitle'),
    };
}

export default async function ForAgenciesPage() {
    const t = await getTranslations('ForAgencies');

    const benefits = [
        {
            icon: <Globe2 className="w-8 h-8 text-blue-600" />,
            title: t('benefits.visibility'),
            description: t('benefits.visibilityDesc'),
            gradient: "from-blue-50 to-indigo-50"
        },
        {
            icon: <Target className="w-8 h-8 text-emerald-600" />,
            title: t('benefits.leads'),
            description: t('benefits.leadsDesc'),
            gradient: "from-emerald-50 to-teal-50"
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
            title: t('benefits.trust'),
            description: t('benefits.trustDesc'),
            gradient: "from-purple-50 to-pink-50"
        },
        {
            icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
            title: t('benefits.insights'),
            description: t('benefits.insightsDesc'),
            gradient: "from-orange-50 to-amber-50"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden bg-slate-900 border-b border-slate-800">
                {/* Background Decorations */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

                <div className="container relative z-10 px-4 mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md animate-fade-in-down shadow-xl">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-medium text-slate-300">{t('hero.tag')}</span>
                    </div>

                    <h1 className="max-w-4xl mx-auto mb-8 text-5xl font-extrabold tracking-tight text-white md:text-7xl animate-fade-in-up leading-tight">
                        {t('hero.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">{t('hero.titleHighlight')}</span>
                    </h1>

                    <p className="max-w-2xl mx-auto mb-12 text-xl text-slate-400 animate-fade-in-up delay-100 leading-relaxed">
                        {t('hero.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
                        <Link
                            href="/auth/signup"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all bg-gradient-to-r from-primary to-indigo-600 rounded-2xl hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:scale-[1.02] shadow-xl shadow-primary/20"
                        >
                            <Rocket className="w-5 h-5 mr-2 animate-bounce-subtle" />
                            {t('hero.listFree')}
                        </Link>
                        <Link
                            href="/agencies"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-300 transition-all bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-800 hover:text-white backdrop-blur-md"
                        >
                            {t('hero.viewDirectory')}
                        </Link>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="relative mt-20 mx-auto max-w-5xl animate-fade-in-up delay-300 perspective-1000">
                        {/* Glow effect under the mockup */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[32px] opacity-20 blur-2xl -z-10" />

                        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform rotate-x-6 hover:rotate-x-0 transition-transform duration-700 ease-out">
                            {/* Mockup Header */}
                            <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="inline-block w-64 h-6 bg-slate-800 rounded-md" />
                                </div>
                            </div>

                            {/* Mockup Content */}
                            <div className="grid grid-cols-12 gap-0">
                                {/* Sidebar */}
                                <div className="hidden md:block col-span-2 border-r border-slate-800 p-4 space-y-4 bg-slate-900/50">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-8 w-full bg-slate-800 rounded-lg opacity-50" />
                                    ))}
                                </div>

                                {/* Main Area */}
                                <div className="col-span-12 md:col-span-10 p-6 bg-slate-950">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
                                            <div className="h-8 w-48 bg-slate-700 rounded" />
                                        </div>
                                        <div className="h-10 w-32 bg-primary/20 rounded-lg" />
                                    </div>

                                    {/* Charts Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        {[
                                            { bg: "bg-blue-500/10", border: "border-blue-500/20" },
                                            { bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                                            { bg: "bg-purple-500/10", border: "border-purple-500/20" }
                                        ].map((style, i) => (
                                            <div key={i} className={`h-32 rounded-xl border ${style.border} ${style.bg} p-4`}>
                                                <div className="h-4 w-20 bg-slate-700/50 rounded mb-4" />
                                                <div className="h-10 w-24 bg-slate-700/50 rounded" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Table */}
                                    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                                        <div className="h-12 border-b border-slate-800 bg-slate-800/30" />
                                        <div className="p-4 space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800" />
                                                    <div className="h-4 w-32 bg-slate-800 rounded" />
                                                    <div className="flex-1" />
                                                    <div className="h-4 w-20 bg-slate-800 rounded" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section Floating */}
            <section className="relative z-20 -mt-8">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
                        {[
                            { label: t('stats.visitors'), value: "50k+", icon: Users2, color: "text-blue-500" },
                            { label: t('stats.active'), value: "4,000+", icon: Building2, color: "text-emerald-500" },
                            { label: t('stats.cities'), value: "300+", icon: Globe2, color: "text-purple-500" },
                            { label: t('stats.leads'), value: "12k+", icon: TrendingUp, color: "text-orange-500" },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Value Proposition */}
            <section className="py-24">
                <div className="container px-4 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">{t('benefits.title')}</h2>
                        <p className="text-xl text-slate-600 leading-relaxed">{t('benefits.subtitle')}</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((item, i) => (
                            <div key={i} className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works for Agencies */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-32 -z-10" />

                <div className="container px-4 mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary text-sm font-semibold mb-6">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                {t('steps.title')}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                                Your Path to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Global Recognition</span>
                            </h2>

                            <div className="space-y-6">
                                {[
                                    {
                                        title: t('steps.step1'),
                                        desc: t('steps.step1Desc'),
                                        color: "bg-blue-500"
                                    },
                                    {
                                        title: t('steps.step2'),
                                        desc: t('steps.step2Desc'),
                                        color: "bg-indigo-500"
                                    },
                                    {
                                        title: t('steps.step3'),
                                        desc: t('steps.step3Desc'),
                                        color: "bg-purple-500"
                                    }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 p-6 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default">
                                        <div className="flex-shrink-0 relative">
                                            <div className={`w-12 h-12 rounded-xl ${step.color} text-white flex items-center justify-center font-bold text-xl shadow-lg relative z-10 group-hover:scale-110 transition-transform`}>
                                                {i + 1}
                                            </div>
                                            {i !== 2 && <div className="absolute top-12 left-1/2 w-0.5 h-full bg-slate-200 -z-0" />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                                            <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 pl-4">
                                <Link href="/auth/signup" className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:gap-4 transition-all">
                                    {t('steps.cta')} <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Interactive Visual */}
                        <div className="order-1 lg:order-2 relative">
                            <div className="relative z-10 bg-white rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.1)] border border-slate-100">
                                {/* Decorative circles */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />

                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-xl transform -rotate-6">
                                        <Star className="w-10 h-10 fill-current" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">Elite Agency Profile</h3>
                                    <p className="text-slate-500">Preview of your verified listing</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                                        <span className="font-medium text-slate-700">Verified Badge</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <Globe2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                        <span className="font-medium text-slate-700">Global Reach</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <Target className="w-6 h-6 text-red-500 flex-shrink-0" />
                                        <span className="font-medium text-slate-700">Direct Leads</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <div className="relative h-12 bg-slate-100 rounded-xl overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full w-3/4 bg-primary rounded-xl animate-pulse" />
                                        <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-900 mix-blend-overlay">
                                            High Profile Strength
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA to close */}
            <CTASection
                title={t('cta.title')}
                subtitle={t('cta.subtitle')}
                primaryAction={{ label: t('cta.button'), href: "/auth/signup" }}
            />
        </div>
    );
}
