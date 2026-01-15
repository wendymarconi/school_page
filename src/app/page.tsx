import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="#">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold text-slate-900">COEM</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Características
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
            Plataforma
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden bg-slate-950">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/hero.png"
              alt="Fondo Escolar"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-start gap-4 max-w-[700px]">
              <div className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-md border border-primary/30">
                Innovación Educativa 2026
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-white sm:text-5xl md:text-6xl/none">
                Colegio pedagógico <br />
                <span className="text-primary">emmanuel (COEM)</span>
              </h1>
              <p className="max-w-[600px] text-slate-300 md:text-xl font-light">
                Una plataforma integral para padres y profesores. Gestiona calificaciones, sigue el progreso académico y fomenta la comunicación escolar en un solo lugar.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
                <Link href="/login">
                  <Button size="lg" className="rounded-full px-8 text-lg hover:scale-105 transition-transform">
                    Acceder a la Plataforma
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="rounded-full px-8 text-lg border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
                  Saber más
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white bg-grid-slate-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900 text-center">
                  Todo lo que necesitas para tu institución
                </h2>
                <p className="max-w-[900px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center mx-auto">
                  Hemos diseñado herramientas específicas para optimizar el tiempo de los profesores y mantener a los padres siempre informados.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="flex flex-col items-center space-y-4 pt-6">
                  <div className="rounded-2xl bg-primary/10 p-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Panel de Profesores</h3>
                  <p className="text-slate-500 text-center">
                    Gestión eficiente de clases, carga interactiva de calificaciones y seguimiento grupal.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="flex flex-col items-center space-y-4 pt-6">
                  <div className="rounded-2xl bg-primary/10 p-4">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Acceso Seguro</h3>
                  <p className="text-slate-500 text-center">
                    Seguridad de datos garantizada y acceso restringido según el rol del usuario.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="flex flex-col items-center space-y-4 pt-6">
                  <div className="rounded-2xl bg-primary/10 p-4">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Visión para Padres</h3>
                  <p className="text-slate-500 text-center">
                    Boletines de notas digitales actualizados en tiempo real para un seguimiento constante.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="text-white font-bold">Colegio pedagógico emmanuel (COEM)</span>
            <span className="text-xs ml-2">© 2026 Reservados todos los derechos.</span>
          </div>
          <nav className="flex gap-4 sm:gap-6 text-xs">
            <Link className="hover:text-white" href="#">Términos</Link>
            <Link className="hover:text-white" href="#">Privacidad</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
