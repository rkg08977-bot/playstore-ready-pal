import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart, getCartDetails, formatINR } from "@/lib/cart";
import { DELIVERY } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | BuildHub" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const { lines, subtotal, delivery, total } = getCartDetails(items);
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setDone(true);
    clear();
    toast.success("Order placed! We'll call you to confirm.");
  };

  if (done) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="h-20 w-20 text-emerald-400" />
        <h1 className="mt-6 text-4xl font-black">Order Confirmed!</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for choosing BuildHub. Our team will call you within 30 minutes to confirm delivery details.
        </p>
        <Button onClick={() => navigate({ to: "/" })} size="lg" className="mt-8 h-12 bg-primary px-8 font-bold uppercase tracking-wider">
          Back to Home
        </Button>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black">Your cart is empty</h1>
        <Button onClick={() => navigate({ to: "/products" })} className="mt-6 bg-primary">Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="mb-8 text-4xl font-black md:text-5xl">Checkout</h1>
      <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">Contact Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" required placeholder="Rahul Sharma" /></div>
              <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" required placeholder="+91 98765 43210" /></div>
              <div className="space-y-2 sm:col-span-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required placeholder="you@example.com" /></div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">Delivery Address</h2>
            <div className="grid gap-4">
              <div className="space-y-2"><Label htmlFor="address">Site / Building address</Label><Input id="address" required placeholder="Plot 24, Sector 10" /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" required defaultValue={DELIVERY.city} /></div>
                <div className="space-y-2"><Label htmlFor="pincode">Pincode</Label><Input id="pincode" required placeholder="400001" /></div>
                <div className="space-y-2"><Label htmlFor="landmark">Landmark</Label><Input id="landmark" placeholder="Near metro" /></div>
              </div>
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
                Currently delivering within <span className="font-bold text-primary">{DELIVERY.radiusKm}km</span> of {DELIVERY.city}.
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">Payment</h2>
            <div className="rounded-md border border-border p-4">
              <div className="font-bold">Cash on Delivery</div>
              <div className="text-sm text-muted-foreground">Pay when materials arrive at your site.</div>
            </div>
          </section>
        </motion.div>

        <aside className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Your Order</h2>
          <div className="max-h-72 space-y-3 overflow-auto border-b border-border pb-4">
            {lines.map((l) => (
              <div key={l.product.id} className="flex items-center gap-3 text-sm">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-background">
                  <img src={l.product.image} alt={l.product.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 font-bold">{l.product.name}</div>
                  <div className="text-xs text-muted-foreground">Qty: {l.quantity}</div>
                </div>
                <div className="font-bold">{formatINR(l.subtotal)}</div>
              </div>
            ))}
          </div>
          <dl className="space-y-2 py-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{delivery === 0 ? <span className="text-emerald-400">FREE</span> : formatINR(delivery)}</dd></div>
          </dl>
          <div className="flex items-baseline justify-between border-t border-border pt-4">
            <span className="font-bold uppercase tracking-wider">Total</span>
            <span className="text-2xl font-black text-primary">{formatINR(total)}</span>
          </div>
          <Button type="submit" size="lg" className="mt-5 h-12 w-full bg-primary text-base font-bold uppercase tracking-wider hover:shadow-glow">
            <Lock className="mr-2 h-4 w-4" /> Place Order
          </Button>
        </aside>
      </form>
    </div>
  );
}