import { signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Users,
    LogOut,
    LayoutDashboard,
    GraduationCap,
    FileText,
    MessageSquare,
    Settings
} from "lucide-react";

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-slate-50/50 md:flex-row">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-white sm:flex md:w-72">
                <div className="flex h-20 items-center px-6 border-b border-slate-100">
                    <Link href="/dashboard/parent" className="flex items-center gap-3 font-black text-primary tracking-tighter text-xl">
                        <div className="p-2 rounded-xl bg-primary/10">
                            <Image src="/logo.png" alt="Logo COEM" width={28} height={28} className="object-contain" />
                        </div>
                        <span className="hidden md:inline">COEM <span className="text-red-600">Familias</span></span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-8">
                    <nav className="flex flex-col gap-2 px-4">
                        <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Menú Principal</p>
                        <Link
                            href="/dashboard/parent"
                            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-600 font-bold transition-all hover:text-primary hover:bg-primary/5 group"
                        >
                            <LayoutDashboard className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                            <span className="hidden md:inline">Mis Hijos</span>
                        </Link>

                        <div className="opacity-50 cursor-not-allowed flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 font-bold transition-all">
                            <FileText className="h-5 w-5" />
                            <span className="hidden md:inline">Boletines (Pronto)</span>
                        </div>

                        <div className="opacity-50 cursor-not-allowed flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 font-bold transition-all">
                            <MessageSquare className="h-5 w-5" />
                            <span className="hidden md:inline">Mensajes</span>
                        </div>
                    </nav>

                    <nav className="mt-10 flex flex-col gap-2 px-4">
                        <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Configuración</p>
                        <div className="opacity-50 cursor-not-allowed flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 font-bold transition-all">
                            <Settings className="h-5 w-5" />
                            <span className="hidden md:inline">Mi Perfil</span>
                        </div>
                    </nav>
                </div>

                <div className="p-6 border-t border-slate-100">
                    <form action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/login" })
                    }}>
                        <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 group">
                            <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-600 transition-colors" />
                            <span className="hidden md:inline">Cerrar Sesión</span>
                        </Button>
                    </form>
                </div>
            </aside>

            <div className="flex flex-col flex-1 sm:pl-16 md:pl-72 min-h-screen">
                <main className="flex-1 p-6 md:p-10 lg:p-12">
                    {children}
                </main>
            </div>
        </div>
    );
}
