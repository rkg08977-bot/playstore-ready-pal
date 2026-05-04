import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Truck, Users, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About BuildHub — Trusted Construction Materials Supplier" },
      { name: "description", content: "BuildHub delivers premium construction materials from India's top brands. Built for builders, contractors and homeowners." },
      { property: "og:title", content: "About BuildHub" },
      { property: "og:description", content: "Trusted supplier of cement, TMT bars and aggregates. Built for builders." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">About Us</div>
            <h1 className="text-5xl font-black leading-[0.95] md:text-7xl">
              Built for <span className="text-gradient">builders.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              We're on a mission to make quality construction materials accessible, affordable and on-time —
              for every site, every project, every builder in India.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-black">Our Story</h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>BuildHub was founded by builders, for builders. After years of dealing with unreliable suppliers, last-minute price hikes and poor-quality materials, we decided enough was enough.</p>
              <p>Today, we partner directly with India's most trusted brands — UltraTech, Tata Tiscon, JSW, Ambuja and more — to bring you genuine materials at fair prices, delivered when you need them.</p>
              <p>From single-bag homeowner orders to truck-load contractor supplies, every order gets the same commitment: quality, transparency and on-time delivery.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { Icon: Award, t: "20+", l: "Trusted Brands" },
              { Icon: Truck, t: "500+", l: "Sites Served" },
              { Icon: Users, t: "10K+", l: "Happy Customers" },
              { Icon: Building2, t: "5+", l: "Years Strong" },
            ].map(({ Icon, t, l }) => (
              <div key={l} className="rounded-lg border border-border bg-card p-6">
                <Icon className="h-8 w-8 text-primary" />
                <div className="mt-4 text-3xl font-black text-primary">{t}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-card to-background p-12 text-center">
          <h2 className="text-4xl font-black">Ready to build with us?</h2>
          <Button asChild size="lg" className="mt-6 h-14 bg-primary px-8 font-bold uppercase tracking-wider hover:shadow-glow">
            <Link to="/products">Start Shopping <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}