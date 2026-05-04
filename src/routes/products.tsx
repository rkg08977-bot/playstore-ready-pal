import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { ProductCard } from "@/components/product-card";
import { useCategories, useProducts } from "@/lib/queries";
import { cn } from "@/lib/utils";

const searchSchema = z.object({ category: z.string().optional() });

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Products | BuildHub" }, { name: "description", content: "Browse construction materials." }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const { category } = Route.useSearch();
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts(category);
  const activeCat = categories.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-10 border-b border-border pb-8">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{activeCat?.description ?? "Catalog"}</div>
        <h1 className="text-4xl font-black md:text-6xl">{activeCat?.name ?? "All Products"}</h1>
        <p className="mt-3 text-muted-foreground">{products.length} products available</p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <Link to="/products" className={cn("rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider", !category ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary")}>
          All
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} to="/products" search={{ category: c.slug }}
            className={cn("rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider", category === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary")}>
            {c.name}
          </Link>
        ))}
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-16 text-center text-muted-foreground">Loading…</div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-16 text-center text-muted-foreground">No products in this category yet.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
