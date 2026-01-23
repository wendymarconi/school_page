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
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link className="flex items-center gap-3 group" href="#">
            <div className="relative w-12 h-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Image src="/logo.png" alt="Logo COEM" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary leading-tight tracking-tight">COEM</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold hidden sm:block">Luz y Esperanza</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {['Institucional', 'Niveles', 'Contacto'].map((item) => (
              <Link
                key={item}
                className="text-sm font-semibold text-slate-600 hover:text-primary transition-all hover:underline decoration-primary decoration-2 underline-offset-8"
                href={`#${item.toLowerCase()}`}
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login?role=teacher">
              <Button variant="outline" className="hidden sm:flex rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold px-6 btn-premium">
                Portal Docente
              </Button>
            </Link>
            <Link href="/login?role=parent">
              <Button className="rounded-full font-bold px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 btn-premium">
                Portal Familiar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* 2. Hero Section */}
        <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero.png"
              alt="Estudiantes COEM"
              fill
              className="object-cover opacity-50 brightness-[0.6] scale-105 animate-pulse-slow"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)]"></div>
          </div>

          <div className="container relative z-10 px-4 mx-auto">
            <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-md border border-primary/20 px-5 py-2 rounded-full text-blue-300 text-sm font-bold tracking-wide">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                ADMISIONES ABIERTAS 2026
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter">
                Educación con <br />
                <span className="text-gradient drop-shadow-sm">
                  Propósito Real
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-2xl opacity-90">
                En el <strong className="text-white font-bold">Colegio EM</strong> formamos líderes con valores sólidos, excelencia académica e innovación constante.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold btn-premium shadow-2xl shadow-primary/30">
                  Iniciar Admisión
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-10 h-16 text-lg font-bold border-white/20 text-slate-900 hover:bg-white/10 glass transition-all">
                  Explorar Niveles
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Quiénes Somos Section */}
        <section id="institucional" className="py-24 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative group">
                <div className="absolute -inset-6 bg-primary/5 rounded-[2.5rem] scale-95 group-hover:scale-100 transition-all duration-700"></div>
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl border border-slate-100">
                  <Image src="/hero.png" alt="Institución COEM" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 glass p-6 rounded-2xl shadow-xl hidden md:block animate-in zoom-in duration-500 delay-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900">20+</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Años de Excelencia</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-primary text-sm font-bold tracking-wide uppercase">
                    Nuestro Legado
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                    Liderazgo Pedagógico en <span className="text-primary italic">Floridablanca</span>
                  </h2>
                </div>
                <p className="text-xl text-slate-600 leading-relaxed font-medium opacity-80">
                  El <strong className="text-slate-900">Colegio Pedagógico Emmanuel (COEM)</strong> es más que una escuela; es un ecosistema de crecimiento donde cada niño es protagonista de su propia historia de éxito.
                </p>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-5 group">
                    <div className="p-4 rounded-2xl bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <School className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-lg">Entornos SEGUROS</h4>
                      <p className="text-sm text-slate-500 font-medium">Infraestructura diseñada para la exploración y el aprendizaje.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 group">
                    <div className="p-4 rounded-2xl bg-red-50 text-destructive group-hover:bg-destructive group-hover:text-white transition-all duration-300">
                      <Users className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-lg">Mentores ÉLITE</h4>
                      <p className="text-sm text-slate-500 font-medium">Docentes apasionados comprometidos con el futuro.</p>
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
                { title: "Preescolar", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10", desc: "Estimulación temprana y desarrollo emocional en un ambiente lúdico." },
                { title: "Primaria", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Bases sólidas en lectoescritura, matemáticas y valores institucionales." },
                { title: "Bachillerato", icon: School, color: "text-red-500", bg: "bg-red-500/10", desc: "Formación crítica y preparatoria para la excelencia profesional." }
              ].map((item, idx) => (
                <Card key={idx} className="group glass border-none hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-[2rem] overflow-hidden">
                  <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                    <div className={`p-6 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                      <item.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed min-h-[80px]">
                      {item.desc}
                    </p>
                    <Button variant="outline" className="rounded-full px-8 border-primary/20 hover:bg-primary hover:text-white transition-all btn-premium">
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
                <Image src="/logo.png" alt="Logo COEM" width={48} height={48} className="object-contain" />
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
                <Link href="/login?role=admin" className="hover:text-primary transition-colors font-bold text-white">Gestión Administrativa</Link>
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
