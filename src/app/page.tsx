import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  BookOpen,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  School,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Header Sticky */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link className="flex items-center gap-3 group" href="#">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
              <Image src="/logo.png" alt="Logo COEM" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary leading-tight">COEM</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium hidden sm:block">Luz y Esperanza</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors hover:underline decoration-2 underline-offset-8" href="#institucional">
              Institucional
            </Link>
            <Link className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors hover:underline decoration-2 underline-offset-8" href="#niveles">
              Niveles
            </Link>
            <Link className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors hover:underline decoration-2 underline-offset-8" href="#contacto">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="hidden sm:flex rounded-full border-primary text-primary hover:bg-primary hover:text-white font-bold px-6">
                Ingresar
              </Button>
            </Link>
            <Link href="/login">
              <Button className="rounded-full font-bold px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                Plataforma
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* 2. Hero Section */}
        <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero.png"
              alt="Estudiantes COEM"
              fill
              className="object-cover opacity-60 brightness-75 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
          </div>

          <div className="container relative z-10 px-4 mx-auto">
            <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Matrículas Abiertas 2026
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                Formamos con <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  Luz y Esperanza
                </span>
              </h1>
              <p className="text-xl text-slate-200 font-light leading-relaxed max-w-2xl">
                En el <strong>Colegio Pedagógico Emmanuel</strong> brindamos una educación integral basada en valores, excelencia académica e innovación pedagógica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold">
                  Proceso de Admisión
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg font-bold border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  Conócenos
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Quiénes Somos Section */}
        <section id="institucional" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/10 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500"></div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <Image src="/hero.png" alt="Institución COEM" fill className="object-contain" />
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-primary font-bold uppercase tracking-widest text-sm">Nuestro Colegio</span>
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Excelencia Pedagógica en Floridablanca</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  El Colegio Pedagógico Emmanuel (COEM) se destaca por su compromiso con el desarrollo integral de cada niño. En el barrio La Cumbre, somos referentes en calidez humana y calidad educativa.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-50">
                      <School className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Infraestructura</h4>
                      <p className="text-sm text-slate-500">Espacios modernos y seguros.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-red-50">
                      <Users className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Docentes</h4>
                      <p className="text-sm text-slate-500">Altamente calificados.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Niveles Académicos (Comfenalco Style Cards) */}
        <section id="niveles" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl font-bold text-slate-900">Niveles Educativos</h2>
              <p className="text-lg text-slate-500">Ofrecemos una formación adaptada a cada etapa del desarrollo infantil y juvenil.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Preescolar", icon: Sparkles, color: "bg-amber-100 text-amber-600", desc: "Estimulación temprana y desarrollo emocional en un ambiente lúdico." },
                { title: "Primaria", icon: BookOpen, color: "bg-blue-100 text-blue-600", desc: "Bases sólidas en lectoescritura, matemáticas y valores institucionales." },
                { title: "Bachillerato", icon: School, color: "bg-red-100 text-red-600", desc: "Formación crítica y preparatoria para la excelencia profesional." }
              ].map((item, idx) => (
                <Card key={idx} className="group border-none shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden bg-white">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className={`p-5 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed min-h-[80px]">
                      {item.desc}
                    </p>
                    <Button variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-white transition-colors">
                      Ver detalle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Contacto Section */}
        <section id="contacto" className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="rounded-[3rem] bg-primary p-8 md:p-16 relative overflow-hidden flex flex-col lg:flex-row gap-12 items-center">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

              <div className="relative z-10 flex-1 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-extrabold text-white">¿Deseas matricular a tu hijo?</h2>
                  <p className="text-blue-50/80 text-xl">Contáctanos y agenda un recorrido por nuestras instalaciones.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">Carrera 9 E #27-58, La Cumbre <br />Floridablanca</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">6583490 - 3107823186 <br />314 229 9803</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">colcoem11@hotmail.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">Matrículas abiertas <br />Lunes a Viernes</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-4 w-full max-w-sm">
                <a
                  href="https://www.facebook.com/p/Colegio-Pedag%C3%B3gico-Emmanuel-100079245709898/?locale=es_LA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-white text-primary py-4 px-8 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-2xl"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Síguenos en Facebook
                </a>
                <Button variant="secondary" className="w-full py-4 px-8 h-auto rounded-2xl font-bold text-lg bg-red-500 hover:bg-red-600 text-white border-none transition-colors shadow-lg">
                  Agendar Cita
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer Profesional */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Logo COEM" width={48} height={48} className="brightness-0 invert" />
                <span className="text-2xl font-bold text-white tracking-tighter">COEM</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                El Colegio Pedagógico Emmanuel se compromete con la formación ética, pedagógica e intelectual de las futuras generaciones de Floridablanca.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm">Navegación</h4>
              <nav className="flex flex-col gap-4 text-slate-400">
                <Link href="#institucional" className="hover:text-primary transition-colors">Institucional</Link>
                <Link href="#niveles" className="hover:text-primary transition-colors">Niveles Educativos</Link>
                <Link href="#contacto" className="hover:text-primary transition-colors">Admisiones</Link>
                <Link href="/login" className="hover:text-primary transition-colors font-bold text-white">Plataforma Virtual</Link>
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm">Legal</h4>
              <nav className="flex flex-col gap-4 text-slate-400">
                <Link href="#" className="hover:text-primary transition-colors">Tratamiento de Datos</Link>
                <Link href="#" className="hover:text-primary transition-colors">Manual de Convivencia</Link>
                <Link href="#" className="hover:text-primary transition-colors">PQRSD</Link>
              </nav>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs text-center md:text-left">
            <p>© 2026 Colegio Pedagógico Emmanuel. Floridablanca, Santander. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <span>Resolución SE 1234 de 2010</span>
              <span>DANE: 1234567890</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
