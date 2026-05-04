import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, Headphones, Package, Hammer, Layers3, Mountain, Box, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useCategories, useProducts, useSiteSettings, useTestimonials, formatINR } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuildHub — Construction Materials Delivered" },
      { name: "description", content: "Order cement, TMT bars, bricks & aggregates from top brands." },
    ],
  }),
  component: Index,
});

const CATEGORY_ICONS: Record<string, typeof Package> = {
  cement: Package, "tmt-bars": Hammer, bricks: Layers3, aggregates: Mountain,
};

function Index() {
  const { data: settings } = useSiteSettings();
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts();
  const { data: testimonials = [] } = useTestimonials();
  const featured = products.slice(0, 8);

  const heroTitle = settings?.hero_title ?? "Build Stronger. Build Smarter.";
  const heroSubtitle = settings?.hero_subtitle ?? "Premium materials delivered.";
  const city = settings?.city ?? "Mumbai";
  const freeAbove = settings?.free_delivery_above ?? 10000;
  const heroImg = settings?.hero_image_url ?? "/products/hero-cement.jpg";

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
          <div className="absolute inset-0 grid-pattern" />
          <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand-blue/25 blur-[120px]" />
          <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-brand-red/25 blur-[140px]" />
        </div>
        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center px-4 py-20 md:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-red/40 bg-card/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-red" />
              Delivering across {city}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-black leading-[0.95] md:text-7xl lg:text-8xl">
              <span className="text-foreground">{heroTitle.split(' ').slice(0, -1).join(' ')} </span>
              <span className="bg-gradient-accent bg-clip-text text-transparent">{heroTitle.split(' ').slice(-1)}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              {heroSubtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-14 bg-brand-red px-8 text-base font-bold uppercase tracking-wider hover:shadow-glow hover:opacity-90">
                <Link to="/products">Shop Materials <ArrowRight className="ml-1 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 border-2 border-brand-blue bg-background/40 px-8 text-base font-bold uppercase tracking-wider text-brand-blue backdrop-blur hover:bg-brand-blue hover:text-white">
                <Link to="/contact">Get a Quote</Link>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-8 border-t border-border/50 pt-8">
              {[
                {n:"500+",l:"Builders Trust Us",c:"text-brand-red"},
                {n:"50K+",l:"Tonnes Delivered",c:"text-brand-blue"},
                {n:"24h",l:"Fast Dispatch",c:"text-foreground"},
              ].map((s)=>(
                <div key={s.l}>
                  <div className={`text-3xl font-black md:text-4xl ${s.c}`}>{s.n}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* USP */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-px bg-border md:grid-cols-4">
          {[
            { Icon: Truck, t: "Free Delivery", d: `On orders above ${formatINR(freeAbove)}`, color: "text-brand-red bg-brand-red/10" },
            { Icon: ShieldCheck, t: "Genuine Brands", d: "100% authentic, ISI certified", color: "text-brand-blue bg-brand-blue/10" },
            { Icon: Box, t: "Bulk Orders", d: "Special pricing for contractors", color: "text-brand-red bg-brand-red/10" },
            { Icon: Headphones, t: "Expert Support", d: "Talk to material specialists", color: "text-brand-blue bg-brand-blue/10" },
          ].map(({ Icon, t, d, color }) => (
            <div key={t} className="flex items-center gap-4 bg-background p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold uppercase tracking-wide">{t}</div>
                <div className="text-xs text-muted-foreground">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-red">Browse</div>
            <h2 className="text-4xl font-black md:text-5xl">Shop by Category</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => {
            const Icon = CATEGORY_ICONS[c.slug] ?? Package;
            const accents = [
              { dot: "bg-brand-red/10 group-hover:bg-brand-red/30", icon: "text-brand-red" },
              { dot: "bg-brand-blue/10 group-hover:bg-brand-blue/30", icon: "text-brand-blue" },
            ];
            const a = accents[i % 2];
            return (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Link to="/products" search={{ category: c.slug }} className="group relative block h-56 overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-glow">
                  <div className={`absolute -right-6 -top-6 h-32 w-32 rounded-full blur-2xl ${a.dot}`} />
                  <Icon className={`h-10 w-10 ${a.icon}`} />
                  <h3 className="mt-8 text-2xl font-black">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  <div className="absolute bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="mb-12">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-blue">Best Sellers</div>
          <h2 className="text-4xl font-black md:text-5xl">Featured Products</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
          <div className="mb-12">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-red">Reviews</div>
            <h2 className="text-4xl font-black md:text-5xl">What Builders Say</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-lg border border-border bg-card p-6">
                <div className="mb-3 flex">{Array.from({ length: t.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-brand-red text-brand-red" />)}</div>
                <p className="text-sm text-muted-foreground">"{t.content}"</p>
                <div className="mt-4 border-t border-border pt-4">
                  <div className="font-bold text-brand-blue">{t.author_name}</div>
                  {t.author_role && <div className="text-xs text-muted-foreground">{t.author_role}</div>}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
