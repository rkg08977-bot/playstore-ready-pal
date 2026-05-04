import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X, User as UserIcon, LogOut, Shield, Package } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useSiteSettings } from "@/lib/queries";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const { user, isAdmin, signOut } = useAuth();
  const { data: settings } = useSiteSettings();
  const businessName = settings?.business_name ?? "BUILDHUB";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={businessName} className="h-9 w-9 rounded-md object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-primary font-black text-primary-foreground">
              {businessName.charAt(0)}
            </div>
          )}
          <span className="text-xl font-black uppercase tracking-tight">{businessName}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-md border border-border hover:border-primary hover:text-primary" aria-label="Account">
                <UserIcon className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/orders"><Package className="mr-2 h-4 w-4" /> My Orders</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><Shield className="mr-2 h-4 w-4" /> Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth" className="hidden h-10 items-center justify-center rounded-md border border-border px-4 text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary md:flex">
              Sign In
            </Link>
          )}

          <button className="flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-border md:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
          {!user && (
            <Link to="/auth" onClick={() => setOpen(false)} className="py-3 text-sm font-semibold uppercase tracking-wider text-primary">Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
