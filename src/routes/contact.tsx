import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSiteSettings } from "@/lib/queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact BuildHub — Talk to a Materials Specialist" },
      { name: "description", content: "Get bulk pricing, project quotes, or material recommendations. Our team is here to help." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: s } = useSiteSettings();
  const city = s?.city ?? "Mumbai";
  const radius = s?.delivery_radius_km ?? 20;
  const phone = s?.phone ?? "+91 98765 43210";
  const email = s?.email ?? "orders@buildhub.in";
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 2 hours.");
    e.currentTarget.reset();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 max-w-3xl">
        <div className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Get in Touch</div>
        <h1 className="text-5xl font-black leading-[0.95] md:text-7xl">Let's <span className="text-gradient">talk.</span></h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Need bulk pricing? Custom project quote? Material recommendations? We're here to help.
        </p>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-border bg-card p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="cname">Name</Label><Input id="cname" required placeholder="Your name" /></div>
            <div className="space-y-2"><Label htmlFor="cphone">Phone</Label><Input id="cphone" type="tel" required placeholder="+91 98765 43210" /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="cemail">Email</Label><Input id="cemail" type="email" required placeholder="you@example.com" /></div>
          <div className="space-y-2"><Label htmlFor="csubject">Subject</Label><Input id="csubject" required placeholder="Bulk order inquiry" /></div>
          <div className="space-y-2"><Label htmlFor="cmsg">Message</Label><Textarea id="cmsg" required rows={6} placeholder="Tell us about your project..." /></div>
          <Button type="submit" size="lg" className="h-12 bg-primary px-8 font-bold uppercase tracking-wider hover:shadow-glow">
            <Send className="mr-2 h-4 w-4" /> Send Message
          </Button>
        </form>

        <aside className="space-y-4">
          {[
            { Icon: Phone, t: "Call Us", v: phone, s: "Mon–Sat, 8 AM – 8 PM" },
            { Icon: Mail, t: "Email", v: email, s: "We reply within 2 hours" },
            { Icon: MapPin, t: "Visit", v: `${city}, India`, s: `Within ${radius}km radius` },
            { Icon: Clock, t: "Hours", v: "Mon – Sat", s: "8:00 AM – 8:00 PM" },
          ].map(({ Icon, t, v, s }) => (
            <div key={t} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t}</div>
                  <div className="mt-1 font-bold">{v}</div>
                  <div className="text-sm text-muted-foreground">{s}</div>
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}