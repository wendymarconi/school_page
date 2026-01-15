import { signOut } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Users,
    LogOut,
    LayoutDashboard,
    GraduationCap
} from "lucide-react";

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex md:w-64">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/dashboard/parent" className="flex items-center gap-2 font-semibold">
                        <GraduationCap className="h-6 w-6" />
                        <span className="hidden md:inline text-primary">COEM - Familias</span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-2 p-2">
                    <Link
                        href="/dashboard/parent"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="hidden md:inline">My Children</span>
                    </Link>
                </nav>
                <div className="mt-auto p-4 border-t">
                    <form action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/login" })
                    }}>
                        <Button variant="ghost" className="w-full justify-start gap-2 px-2 md:px-4">
                            <LogOut className="h-5 w-5" />
                            <span className="hidden md:inline">Sign Out</span>
                        </Button>
                    </form>
                </div>
            </aside>

            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 md:pl-64">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
