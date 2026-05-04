import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, imageUrl } from "@/lib/queries";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary hover:shadow-glow"
      >
        <div className="relative aspect-square overflow-hidden bg-background">
          <img
            src={imageUrl(product.image_url)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.brand && (
            <div className="absolute left-3 top-3 rounded bg-background/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
              {product.brand}
            </div>
          )}
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>{product.rating ?? 4.5}</span>
            <span>· Min order {product.min_order} {product.unit.split(" ")[0]}</span>
          </div>
          <h3 className="line-clamp-2 font-bold uppercase leading-tight tracking-tight text-foreground">{product.name}</h3>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black text-primary">{formatINR(product.price)}</span>
              <span className="ml-1 text-xs text-muted-foreground">/ {product.unit}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
