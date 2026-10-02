import {
  Car,
  UtensilsCrossed,
  Store,
  MapPin,
  Zap,
  Shield,
  ArrowLeft,
  Layers,
} from "lucide-react";
import { FeatureCard } from "@/shared/ui/ui-bits";
import { Link } from "react-router-dom";
import logo from "@/assets/Picture1.png";

const services = [
  {
    icon: <Car className="h-6 w-6" />,
    title: "الرحلات",
    description: "نقل ركاب بمطابقة عبر GPS وتتبع لحظي وتسعير شفاف.",
    badge: "01",
    to: "/ride-request",
  },
  {
    icon: <UtensilsCrossed className="h-6 w-6" />,
    title: "توصيل الطعام",
    description:
      "اطلب من المطاعم المحلية مع إدارة قوائم الطعام ومتابعة الطلب لحظياً.",
    badge: "02",
    to: "/restaurants",
  },
  {
    icon: <Store className="h-6 w-6" />,
    title: "طلبات المتاجر",
    description: "تصفح المتاجر، أدر سلة المشتريات، وادفع عند الاستلام.",
    badge: "03",
    to: "/shops",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-grid" aria-hidden />

        <div className="mx-auto max-w-7xl px-6 pt-20 pb-28 md:pt-28 md:pb-36 relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 backdrop-blur">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                  <span className="font-mono text-xs text-muted-foreground">
                    متعدد الخدمات · لحظي · قابل للتوسع
                  </span>
                </div>

                <h1 className="mt-6 font-display text-5xl font-bold leading-[1.15] tracking-tight md:text-7xl">
                  وطن جو
                </h1>
                <p className="mt-6 font-display text-2xl md:text-4xl font-semibold leading-tight text-muted-foreground">
                  منصة واحدة لـلتنقل والتوصيل والتسوق.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    to="/ride-request"
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 px-6 py-3.5 text-sm font-semibold text-primary-foreground glow transition-transform hover:scale-[1.02]"
                  >
                    احجز رحلة
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </Link>
                  <Link
                    to="/restaurants"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-secondary"
                  >
                    اطلب الطعام
                  </Link>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-6 max-w-xs">
                  {[
                    { v: "3", l: "خدمات" },
                    { v: "24/7", l: "لحظي" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="font-display text-3xl font-bold text-gradient">
                        {s.v}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <img src={logo} alt="Watan Go Logo" className="w-full max-w-md object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div className="max-w-xl">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              المنصة
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl leading-tight">
              ثلاث خدمات. <span className="text-gradient">منظومة واحدة.</span>
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.title}
              to={s.to}
              className="block transition-transform hover:scale-[1.01]"
            >
              <FeatureCard
                icon={s.icon}
                title={s.title}
                description={s.description}
                badge={s.badge}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl border border-border bg-surface p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan/20 blur-3xl" />

          <div className="relative">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
              لماذا وطن جو
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl max-w-2xl leading-tight">
              مهندس ليتوسع من مدينة واحدة إلى وطن كامل.
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-4">
              {[
                {
                  icon: <MapPin className="h-5 w-5" />,
                  t: "تتبع لحظي",
                  d: "تشغيل GPS لحظي",
                },
                {
                  icon: <Layers className="h-5 w-5" />,
                  t: "متعدد الخدمات",
                  d: "نقل · طعام · متاجر",
                },
                {
                  icon: <Zap className="h-5 w-5" />,
                  t: "قابل للتوسع",
                  d: "مبني للأحمال العالية",
                },
                {
                  icon: <Shield className="h-5 w-5" />,
                  t: "آمن",
                  d: "تشفير ومصادقة",
                },
              ].map((h) => (
                <div key={h.t}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-primary border border-border">
                    {h.icon}
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">
                    {h.t}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{h.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
