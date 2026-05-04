import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart, calcCart, formatINR } from "@/lib/cart";
import { useSiteSettings, imageUrl } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | BuildHub" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const { data: settings } = useSiteSettings();
  const freeAbove = Number(settings?.free_delivery_above ?? 10000);
  const charge = Number(settings?.delivery_charge ?? 100);
  const { subtotal, delivery, total } = calcCart(items, freeAbove, charge);
  const [done, setDone] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "", phone: "", email: "", address: "",
    city: settings?.city ?? "Mumbai", pincode: "", landmark: "", notes: "",
  });

  useEffect(() => { if (settings?.city) setForm((f) => ({ ...f, city: settings.city ?? f.city })); }, [settings?.city]);
  useEffect(() => { if (user?.email) setForm((f) => ({ ...f, email: f.email || user.email || "" })); }, [user]);

  useEffect(() => {
    if (!loading && !user && items.length > 0) {
      toast.info("Please sign in to place an order");
      navigate({ to: "/auth", search: { redirect: "/checkout" } });
    }
  }, [loading, user, items.length, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    setSubmitting(true);

    const { data: order, error } = await supabase.from("orders").insert({
      user_id: user.id,
      full_name: form.full_name, phone: form.phone, email: form.email,
      address: form.address, city: form.city, pincode: form.pincode, landmark: form.landmark || null,
      subtotal, delivery_fee: delivery, total, payment_method: "cod", notes: form.notes || null,
    }).select().single();

    if (error || !order) {
      setSubmitting(false);
      toast.error(error?.message ?? "Failed to place order");
      return;
    }

    const itemsPayload = items.map((i) => ({
      order_id: order.id, product_id: i.productId, product_name: i.name, product_image: i.image,
      unit: i.unit, unit_price: i.price, quantity: i.quantity, subtotal: i.price * i.quantity,
    }));
    const { error: itemErr } = await supabase.from("order_items").insert(itemsPayload);
    if (itemErr) {
      setSubmitting(false);
      toast.error(itemErr.message);
      return;
    }

    setDone(order.order_number);
    clear();
    setSubmitting(false);
    toast.success("Order placed!");
  };

  if (done) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="h-20 w-20 text-emerald-400" />
        <h1 className="mt-6 text-4xl font-black">Order Confirmed!</h1>
        <p className="mt-3 text-muted-foreground">Order <span className="font-bold text-primary">{done}</span>. We'll call you within 30 minutes to confirm delivery details.</p>
        <div className="mt-8 flex gap-3">
          <Button asChild size="lg" className="bg-primary"><Link to="/orders">View My Orders</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/">Back to Home</Link></Button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black">Your cart is empty</h1>
        <Button asChild className="mt-6 bg-primary"><Link to="/products">Browse Products</Link></Button>
      </div>
    );
  }

  if (!user) return <div className="mx-auto max-w-xl px-4 py-20 text-center text-muted-foreground">Redirecting…</div>;

  const radius = settings?.delivery_radius_km ?? 20;
  const cityLabel = settings?.city ?? "Mumbai";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="mb-8 text-4xl font-black md:text-5xl">Checkout</h1>
      <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-2 sm:col-span-2"><Label>Email</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">Delivery Address</h2>
            <div className="grid gap-4">
              <div className="space-y-2"><Label>Site / Building address</Label><Input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2"><Label>City</Label><Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div className="space-y-2"><Label>Pincode</Label><Input required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
                <div className="space-y-2"><Label>Landmark</Label><Input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Order notes (optional)</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
                Currently delivering within <span className="font-bold text-primary">{radius}km</span> of {cityLabel}.
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
            {items.map((l) => (
              <div key={l.productId} className="flex items-center gap-3 text-sm">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-background">
                  <img src={imageUrl(l.image)} alt={l.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 font-bold">{l.name}</div>
                  <div className="text-xs text-muted-foreground">Qty: {l.quantity}</div>
                </div>
                <div className="font-bold">{formatINR(l.price * l.quantity)}</div>
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
          <Button type="submit" disabled={submitting} size="lg" className="mt-5 h-12 w-full bg-primary text-base font-bold uppercase tracking-wider hover:shadow-glow">
            <Lock className="mr-2 h-4 w-4" /> {submitting ? "Placing…" : "Place Order"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
