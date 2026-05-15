import { Link, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
    const { user } = useAuth();

    if (user) {
        return (
            <Navigate
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                replace
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
                    <Link to="/" className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-900 to-cyan-500 text-lg font-black text-white shadow-lg sm:h-12 sm:w-12 sm:text-xl sm:rounded-2xl">
                            ⚡
                        </div>

                        <div>
                            <h1 className="text-lg font-black text-slate-900 sm:text-xl">
                                EBMS India
                            </h1>
                            <p className="hidden text-xs uppercase tracking-[0.3em] text-slate-500 sm:block">
                                Smart Electricity Billing
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/login"
                            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-600 sm:px-5 sm:py-2 sm:text-sm"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-full bg-gradient-to-r from-blue-900 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition hover:scale-105 sm:px-5 sm:py-2 sm:text-sm"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section with Carousel */}
      <section className="relative h-[320px] sm:h-[400px] md:h-[530px] lg:h-[590px] overflow-hidden">
    <HeroCarousel />
</section>
            {/* Features Section */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 md:py-20">
                <div className="text-center">
                    <p className="font-semibold uppercase tracking-[0.3em] text-teal-600 text-sm">
                        Features
                    </p>

                    <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                        Powerful Features
                    </h2>
                </div>

                <div className="mt-10 sm:mt-12 md:mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: 'Smart Billing',
                            desc: 'Automatic bill generation using meter readings.',
                            icon: '⚡',
                        },
                        {
                            title: 'Online Payments',
                            desc: 'Secure online payment processing.',
                            icon: '💳',
                        },
                        {
                            title: 'Usage Tracking',
                            desc: 'Monitor consumption and payment history.',
                            icon: '📊',
                        },
                        {
                            title: 'Admin Tools',
                            desc: 'Complete management dashboard.',
                            icon: '🛠️',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="group rounded-2xl bg-white p-6 sm:p-8 shadow-md transition hover:-translate-y-2 hover:shadow-xl animate-fade-in"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-900 to-cyan-500 text-2xl text-white shadow-lg group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
                                {item.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Workflow Section */}
            <section className="bg-slate-950 py-12 sm:py-16 md:py-20 text-white">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="text-center">
                        <p className="font-semibold uppercase tracking-[0.3em] text-teal-300 text-sm">
                            Workflow
                        </p>

                        <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                            How It Works
                        </h2>
                    </div>

                    <div className="mt-10 sm:mt-12 md:mt-16 grid gap-6 md:grid-cols-3">
                        {[
                            {
                                step: '01',
                                title: 'Register User',
                                desc: 'Consumers create accounts with meter details.',
                            },
                            {
                                step: '02',
                                title: 'Generate Bills',
                                desc: 'Meter readings added, bills generated automatically.',
                            },
                            {
                                step: '03',
                                title: 'Pay Bills',
                                desc: 'Instantly pay bills online securely.',
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur hover:bg-white/10 transition animate-fade-in"
                            >
                                <div className="text-4xl sm:text-5xl font-black text-teal-400">
                                    {item.step}
                                </div>

                                <h3 className="mt-4 text-xl sm:text-2xl font-bold">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-900 to-cyan-500 py-12 sm:py-16 md:py-20 text-white">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-black sm:text-4xl md:text-5xl leading-tight">
                        Ready to Simplify Your Electricity Bills?
                    </h2>

                    <p className="mt-4 text-sm sm:text-base md:text-lg opacity-90 leading-relaxed">
                        Join thousands of users managing their electricity billing with ease.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto rounded-full bg-white px-8 py-3 font-bold text-teal-600 transition hover:scale-105 hover:shadow-xl text-center"
                        >
                            Get Started Now
                        </Link>

                        <Link
                            to="/login"
                            className="w-full sm:w-auto rounded-full border-2 border-white bg-transparent px-8 py-3 font-bold text-white transition hover:bg-white/10 text-center"
                        >
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-900 to-cyan-500 text-lg font-black text-white">
                                    ⚡
                                </div>
                                <span className="font-black text-slate-900 text-lg">EBMS India</span>
                            </div>
                            <p className="mt-4 text-sm text-slate-600">
                                Smart electricity billing platform for modern India.
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">
                                © 2025 EBMS India. All rights reserved.
                            </p>
                            <p className="mt-2 text-xs text-slate-600">
                                Built for simplicity and security.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;