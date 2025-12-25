import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] bg-pink-50 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden z-10 relative border border-white/20">
                <div className="absolute top-4 left-4 z-20">
                    <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                        <MoveLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}
