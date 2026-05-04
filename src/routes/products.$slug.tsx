import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingCart, ArrowLeft, Truck, ShieldCheck, Star, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart, formatINR as fmt } from "@/lib/cart";
import { useProduct, useProducts, useSiteSettings, formatINR, imageUrl } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} | BuildHub` },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: settings } = useSiteSettings();
  const { data: all = [] } = useProducts(product?.category_slug);
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) setQty(product.min_order);
  }, [product]);

  if (isLoading) return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black">Product not found</h1>
        <Link to="/products" className="mt-4 inline-block text-primary underline">Back to products</Link>
      </div>
    );
  }

  const related = all.filter((p) => p.id !== product.id).slice(0, 4);
  const freeAbove = settings?.free_delivery_above ?? 10000;

  const handleAdd = () => {
    if (qty < product.min_order) {
      toast.error(`Minimum order is ${product.min_order} ${product.unit}`);
      return;
    }
    add({
      productId: product.id, slug: product.slug, name: product.name, brand: product.brand,
      price: Number(product.price), unit: product.unit, image: product.image_url, minOrder: product.min_order,
    }, qty);
    toast.success(`Added ${qty} × ${product.name} to cart`);
  };

  const specs = Array.isArray(product.specs) ? product.specs : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-xl border border-border bg-card">
          <img src={imageUrl(product.image_url)} alt={product.name} className="h-full w-full object-cover" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {product.brand && <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{product.brand}</div>}
          <h1 className="text-3xl font-black leading-tight md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" /> {product.rating ?? 4.5}</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-400"><Check className="h-4 w-4" /> {product.in_stock ? "In stock" : "Out of stock"}</span>
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-5xl font-black text-primary">{formatINR(Number(product.price))}</span>
            <span className="text-muted-foreground">/ {product.unit}</span>
          </div>

          {product.description && <p className="mt-6 text-muted-foreground">{product.description}</p>}

          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Minimum order: {product.min_order} {product.unit}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-md border border-border">
                <button onClick={() => setQty((q) => Math.max(product.min_order, q - 1))} className="flex h-12 w-12 items-center justify-center hover:bg-secondary"><Minus className="h-4 w-4" /></button>
                <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="h-12 w-20 border-x border-border bg-transparent text-center font-bold focus:outline-none" />
                <button onClick={() => setQty((q) => q + 1)} className="flex h-12 w-12 items-center justify-center hover:bg-secondary"><Plus className="h-4 w-4" /></button>
              </div>
              <Button onClick={handleAdd} disabled={!product.in_stock} size="lg" className="h-12 flex-1 bg-primary text-base font-bold uppercase tracking-wider hover:shadow-glow">
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Subtotal: <span className="font-bold text-foreground">{fmt(Number(product.price) * qty)}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-md border border-border bg-card p-4">
              <Truck className="h-5 w-5 text-primary" />
              <div className="text-sm"><div className="font-bold">Free delivery</div><div className="text-xs text-muted-foreground">Above {formatINR(freeAbove)}</div></div>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border bg-card p-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div className="text-sm"><div className="font-bold">100% Genuine</div><div className="text-xs text-muted-foreground">ISI certified</div></div>
            </div>
          </div>

          {specs.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Specifications</h2>
              <dl className="overflow-hidden rounded-lg border border-border">
                {specs.map((s, i) => (
                  <div key={i} className={`flex justify-between p-4 text-sm ${i % 2 === 0 ? "bg-card" : "bg-background"}`}>
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-bold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 text-3xl font-black">Related Products</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
