import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Truck } from "lucide-react";
import { useSiteSettings } from "@/lib/queries";

export function SiteFooter() {
  const { data: s } = useSiteSettings();
  const name = s?.business_name ?? "BuildHub";
  const city = s?.city ?? "Mumbai";
  const phone = s?.phone ?? "+91 98765 43210";
  const email = s?.email ?? "orders@buildhub.in";
  const radius = s?.delivery_radius_km ?? 20;

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-primary font-black text-primary-foreground">{name.charAt(0)}</div>
            <span className="text-xl font-black uppercase tracking-tight">{name}</span>
          </div>
          <p className="text-sm text-muted-foreground">{s?.tagline ?? "Your trusted partner for quality construction materials."}</p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold tracking-widest text-foreground">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" search={{ category: "cement" }} className="hover:text-primary">Cement</Link></li>
            <li><Link to="/products" search={{ category: "tmt-bars" }} className="hover:text-primary">TMT Bars</Link></li>
            <li><Link to="/products" search={{ category: "bricks" }} className="hover:text-primary">Bricks &amp; Blocks</Link></li>
            <li><Link to="/products" search={{ category: "aggregates" }} className="hover:text-primary">Aggregates</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold tracking-widest text-foreground">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/orders" className="hover:text-primary">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold tracking-widest text-foreground">Reach Us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><span>{city}, India</span></li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /><span>{phone}</span></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /><span>{email}</span></li>
            <li className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 text-primary" /><span>Within {radius}km</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {name}. All rights reserved. · Designed and developed by{" "}
        <a href="https://webstra.co" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">
          Webstra
        </a>
      </div>
    </footer>
  );
}
