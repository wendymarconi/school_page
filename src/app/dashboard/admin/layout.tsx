import { logout } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Users,
    LogOut,
    LayoutDashboard,
    GraduationCap,
    UserPlus,
    BookOpen,
    Contact,
    UserCircle
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-white/80 backdrop-blur-xl sm:flex md:w-64 transition-all duration-300">
                <div className="flex h-20 items-center px-6 border-b border-slate-100">
                    <Link href="/dashboard/admin" className="flex items-center gap-3 font-bold group">
                        <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
                            <Image src="/logo.png" alt="Logo COEM" fill className="object-contain" />
                        </div>
                        <span className="hidden md:inline text-primary tracking-tighter text-lg">COEM <span className="text-slate-400 font-medium">Admin</span></span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    {[
                        { href: "/dashboard/admin", icon: LayoutDashboard, label: "Panel Principal" },
                        { href: "/dashboard/admin/subjects", icon: BookOpen, label: "Materias" },
                        { href: "/dashboard/admin/teachers", icon: Contact, label: "Profesores" },
                        { href: "/dashboard/admin/parents", icon: Users, label: "Acudientes" },
                        { href: "/dashboard/admin/students", icon: GraduationCap, label: "Alumnos" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 font-semibold transition-all hover:text-primary hover:bg-primary/5 active:scale-95 group"
                        >
                            <item.icon className="h-5 w-5 group-hover:rotate-6 transition-transform" />
                            <span className="hidden md:inline">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto p-4 border-t border-slate-100 flex flex-col gap-2">
                    <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 font-semibold transition-all hover:text-primary hover:bg-primary/5 group"
                    >
                        <UserCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="hidden md:inline">Mi Perfil</span>
                    </Link>
                    <form action={logout}>
                        <Button variant="ghost" className="w-full justify-start gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-destructive hover:bg-destructive/5 font-semibold transition-all">
                            <LogOut className="h-5 w-5" />
                            <span className="hidden md:inline">Cerrar Sesión</span>
                        </Button>
                    </form>
                </div>
            </aside>

            <div className="flex flex-col sm:gap-4 sm:pl-16 md:pl-64">
                <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-white/50 backdrop-blur-lg px-6 sm:bg-transparent sm:border-none">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Administración Escolar</h2>
                </header>
                <main className="grid flex-1 items-start gap-8 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
