import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  category: z.enum(["cement", "tmt-bars", "bricks", "aggregates"]).optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Products — Cement, TMT Bars, Bricks & Aggregates | BuildHub" },
      { name: "description", content: "Browse premium construction materials. Cement, steel rebar, bricks and aggregates from trusted brands with fast delivery." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { category } = Route.useSearch();
  const list = useMemo(
    () => (category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS),
    [category],
  );
  const activeCat = CATEGORIES.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-10 border-b border-border pb-8">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
          {activeCat ? activeCat.description : "Catalog"}
        </div>
        <h1 className="text-4xl font-black md:text-6xl">
          {activeCat ? activeCat.name : "All Products"}
        </h1>
        <p className="mt-3 text-muted-foreground">{list.length} products available</p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          to="/products"
          className={cn(
            "rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
            !category
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary",
          )}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            to="/products"
            search={{ category: c.slug }}
            className={cn(
              "rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
              category === c.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-16 text-center">
          <p className="text-muted-foreground">No products in this category yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}