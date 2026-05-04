import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, getCartDetails, formatINR } from "@/lib/cart";
import { DELIVERY } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart | BuildHub" }, { name: "description", content: "Review your construction materials order before checkout." }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const { lines, subtotal, delivery, total } = getCartDetails(items);
  const toFreeDelivery = Math.max(0, DELIVERY.freeAbove - subtotal);

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 text-4xl font-black">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Start adding materials to build your order.</p>
        <Button asChild size="lg" className="mt-8 h-12 bg-primary px-8 font-bold uppercase tracking-wider hover:shadow-glow">
          <Link to="/products">Browse Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="mb-8 text-4xl font-black md:text-5xl">Your Cart</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          {lines.map((line, i) => (
            <motion.div
              key={line.product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <Link to="/products/$slug" params={{ slug: line.product.slug }} className="h-28 w-28 shrink-0 overflow-hidden rounded-md bg-background">
                <img src={line.product.image} alt={line.product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold uppercase tracking-widest text-primary">{line.product.brand}</div>
                <Link to="/products/$slug" params={{ slug: line.product.slug }} className="line-clamp-2 font-bold hover:text-primary">
                  {line.product.name}
                </Link>
                <div className="mt-1 text-sm text-muted-foreground">
                  {formatINR(line.product.price)} / {line.product.unit}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-border">
                    <button onClick={() => setQty(line.product.id, line.quantity - 1)} className="flex h-9 w-9 items-center justify-center hover:bg-secondary" aria-label="Decrease">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold">{line.quantity}</span>
                    <button onClick={() => setQty(line.product.id, line.quantity + 1)} className="flex h-9 w-9 items-center justify-center hover:bg-secondary" aria-label="Increase">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => remove(line.product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-primary">{formatINR(line.subtotal)}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Order Summary</h2>
          {toFreeDelivery > 0 && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-xs">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Add <span className="font-bold text-primary">{formatINR(toFreeDelivery)}</span> more for FREE delivery
              </span>
            </div>
          )}
          <dl className="space-y-3 border-b border-border pb-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-bold">{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="font-bold">{delivery === 0 ? <span className="text-emerald-400">FREE</span> : formatINR(delivery)}</dd>
            </div>
          </dl>
          <div className="my-5 flex items-baseline justify-between">
            <span className="font-bold uppercase tracking-wider">Total</span>
            <span className="text-3xl font-black text-primary">{formatINR(total)}</span>
          </div>
          <Button asChild size="lg" className="h-12 w-full bg-primary text-base font-bold uppercase tracking-wider hover:shadow-glow">
            <Link to="/checkout">Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Delivery within {DELIVERY.radiusKm}km of {DELIVERY.city}
          </p>
        </aside>
      </div>
    </div>
  );
}