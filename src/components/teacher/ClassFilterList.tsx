'use client';

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, ChevronRight, Clock, MapPin, Search } from "lucide-react";

interface ClassType {
    id: string;
    name: string;
    location: string | null;
    schedule: string | null;
    _count: {
        students: number;
    };
}

export default function ClassFilterList({ classes }: { classes: ClassType[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cls.location && cls.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative group max-w-2xl mx-auto md:mx-0">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Search className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar por materia (ej: Matemáticas) o curso (ej: 10A)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-16 rounded-[2rem] bg-white border-2 border-slate-100 pl-16 pr-8 text-lg font-bold shadow-sm focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-slate-300"
                />
                {searchTerm && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <span className="text-xs font-black text-primary/40 uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                            {filteredClasses.length} resultados
                        </span>
                    </div>
                )}
            </div>

            <div className="grid gap-6">
                {filteredClasses.map((cls) => (
                    <Link key={cls.id} href={`/dashboard/teacher/classes/${cls.id}`}>
                        <Card className="group glass border-none hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden rounded-[3rem]">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="p-10 flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                                <GraduationCap className="h-6 w-6" />
                                            </div>
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                                                {cls.location || 'Grado'}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors mb-6 tracking-tight">
                                            {cls.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-8">
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <div className="p-2 rounded-xl bg-slate-50 text-slate-400">
                                                    <Clock className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-bold tracking-tight">{cls.schedule || 'Horario flexible'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <div className="p-2 rounded-xl bg-slate-50 text-slate-400">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-bold tracking-tight">{cls.location || 'Aula virtual'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 md:w-56 p-10 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 group-hover:bg-primary/[0.02] transition-colors">
                                        <p className="text-5xl font-black text-slate-900 tracking-tighter">{cls._count.students}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Estudiantes</p>
                                        <div className="mt-8 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-200 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                            <ChevronRight className="h-7 w-7" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {filteredClasses.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
                        <Search className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-slate-400 tracking-tight">No encontramos esa clase</h2>
                        <p className="text-slate-400 font-bold mt-2">Intenta con otro nombre de materia o curso.</p>
                        <button
                            onClick={() => setSearchTerm("")}
                            className="mt-8 px-8 py-3 bg-white text-primary border-2 border-primary rounded-2xl font-black text-sm hover:bg-primary hover:text-white transition-all shadow-lg"
                        >
                            Ver todas las clases
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
