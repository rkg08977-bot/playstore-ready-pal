import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Package } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useMyOrders } from "@/lib/queries";
import { formatINR } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders | BuildHub" }] }),
  component: OrdersPage,
});

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400",
  confirmed: "text-blue-400",
  out_for_delivery: "text-primary",
  delivered: "text-emerald-400",
  cancelled: "text-destructive",
};

function OrdersPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: orders = [], isLoading } = useMyOrders(user?.id);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/orders" } });
  }, [loading, user, navigate]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <h1 className="mb-2 text-4xl font-black md:text-5xl">My Orders</h1>
      <p className="mb-10 text-muted-foreground">Track all your past and current orders</p>

      {isLoading ? <div className="text-center text-muted-foreground">Loading…</div>
        : orders.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-16 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No orders yet.</p>
            <Button asChild className="mt-6 bg-primary"><Link to="/products">Start Shopping</Link></Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order</div>
                    <div className="text-lg font-black text-primary">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold uppercase tracking-wider ${STATUS_COLORS[o.status]}`}>{o.status.replace("_", " ")}</div>
                    <div className="mt-1 text-xl font-black">{formatINR(Number(o.total))}</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {o.order_items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-sm">
                      <div className="min-w-0 flex-1">
                        <span className="font-bold">{it.product_name}</span>
                        <span className="text-muted-foreground"> × {it.quantity} {it.unit}</span>
                      </div>
                      <div className="font-bold">{formatINR(Number(it.subtotal))}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  Deliver to: {o.address}, {o.city} – {o.pincode} · {o.phone}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
