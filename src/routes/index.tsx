import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, Headphones, Package, Hammer, Layers3, Mountain, Box } from "lucide-react";
import heroImg from "@/assets/hero-cement.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCTS, DELIVERY } from "@/lib/products";
import { formatINR } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuildHub — Construction Materials Delivered to Your Site" },
      { name: "description", content: "Order cement, TMT bars, bricks & aggregates from top brands. Free delivery on orders above ₹10,000 within Mumbai." },
    ],
  }),
  component: Index,
});

const CATEGORY_ICONS: Record<string, typeof Package> = {
  cement: Package,
  "tmt-bars": Hammer,
  bricks: Layers3,
  aggregates: Mountain,
};

function Index() {
  const featured = PRODUCTS.slice(0, 8);
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Industrial cement warehouse"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl items-center px-4 py-20 md:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Delivering across {DELIVERY.city}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-black leading-[0.95] md:text-7xl lg:text-8xl"
            >
              Build <span className="text-gradient">Bigger.</span>
              <br />
              Build <span className="text-gradient">Better.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
            >
              Premium cement, TMT bars, bricks & aggregates from India's most trusted brands —
              delivered to your construction site. Fast, reliable, no compromises.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="h-14 bg-primary px-8 text-base font-bold uppercase tracking-wider hover:bg-primary/90 hover:shadow-glow">
                <Link to="/products">
                  Shop Materials <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 border-border px-8 text-base font-bold uppercase tracking-wider hover:border-primary hover:text-primary">
                <Link to="/contact">Get a Quote</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-8"
            >
              {[
                { v: "500+", l: "Builders Served" },
                { v: "12hr", l: "Avg Delivery" },
                { v: "20+", l: "Trusted Brands" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-3xl font-black text-primary md:text-4xl">{s.v}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* USP STRIP */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-px bg-border md:grid-cols-4">
          {[
            { Icon: Truck, t: "Free Delivery", d: `On orders above ${formatINR(DELIVERY.freeAbove)}` },
            { Icon: ShieldCheck, t: "Genuine Brands", d: "100% authentic, ISI certified" },
            { Icon: Box, t: "Bulk Orders", d: "Special pricing for contractors" },
            { Icon: Headphones, t: "Expert Support", d: "Talk to material specialists" },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="flex items-center gap-4 bg-background p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
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
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Browse</div>
            <h2 className="text-4xl font-black md:text-5xl">Shop by Category</h2>
          </div>
          <Link to="/products" className="hidden items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary hover:underline md:inline-flex">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const Icon = CATEGORY_ICONS[c.slug] ?? Package;
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to="/products"
                  search={{ category: c.slug }}
                  className="group relative block h-56 overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-glow"
                >
                  <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/20" />
                  <Icon className="h-10 w-10 text-primary" />
                  <h3 className="mt-8 text-2xl font-black">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  <div className="absolute bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-secondary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Best Sellers</div>
            <h2 className="text-4xl font-black md:text-5xl">Featured Products</h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card to-background p-10 md:p-16"
        >
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl font-black leading-tight md:text-5xl">
              Building something <span className="text-gradient">big?</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get bulk pricing, dedicated account manager, and priority delivery for projects over ₹5 lakh.
            </p>
            <Button asChild size="lg" className="mt-8 h-14 bg-primary px-8 text-base font-bold uppercase tracking-wider hover:shadow-glow">
              <Link to="/contact">Talk to Sales <ArrowRight className="ml-1 h-5 w-5" /></Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
