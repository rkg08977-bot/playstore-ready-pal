import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shield, Plus, Trash2, Save, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, useCategories, useTestimonials, useSiteSettings, formatINR, imageUrl } from "@/lib/queries";
import type { Product, Testimonial, SiteSettings, Order, OrderItem } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | BuildHub" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/admin" } });
  }, [loading, user, navigate]);

  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Shield className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-2xl font-black">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">Your account does not have admin privileges.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-8 flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-black">Admin Panel</h1>
      </div>
      <Tabs defaultValue="settings">
        <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="settings">Site</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="settings"><SettingsTab /></TabsContent>
        <TabsContent value="products"><ProductsTab /></TabsContent>
        <TabsContent value="orders"><OrdersTab /></TabsContent>
        <TabsContent value="testimonials"><TestimonialsTab /></TabsContent>
        <TabsContent value="categories"><CategoriesTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function SettingsTab() {
  const { data, isLoading } = useSiteSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<SiteSettings | null>(null);
  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading || !form) return <div>Loading…</div>;

  const save = async () => {
    const { error } = await supabase.from("site_settings").update({
      business_name: form.business_name, tagline: form.tagline, logo_url: form.logo_url,
      hero_title: form.hero_title, hero_subtitle: form.hero_subtitle, hero_image_url: form.hero_image_url,
      about_text: form.about_text, phone: form.phone, email: form.email, address: form.address, city: form.city,
      delivery_radius_km: form.delivery_radius_km, free_delivery_above: form.free_delivery_above, delivery_charge: form.delivery_charge,
      whatsapp: form.whatsapp, instagram: form.instagram, facebook: form.facebook, updated_at: new Date().toISOString(),
    }).eq("id", 1);
    if (error) toast.error(error.message);
    else { toast.success("Settings saved"); qc.invalidateQueries({ queryKey: ["site_settings"] }); }
  };

  const F = (key: keyof SiteSettings, label: string, type: "text" | "number" | "textarea" = "text") => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {type === "textarea" ? (
        <Textarea value={(form[key] ?? "") as string} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      ) : (
        <Input type={type} value={(form[key] ?? "") as string | number}
          onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })} />
      )}
    </div>
  );

  return (
    <div className="space-y-6 rounded-lg border border-border bg-card p-6">
      <div className="grid gap-4 md:grid-cols-2">
        {F("business_name", "Business Name")}
        {F("tagline", "Tagline")}
        {F("logo_url", "Logo URL (optional)")}
        {F("hero_image_url", "Hero Image URL")}
        {F("hero_title", "Hero Title")}
        {F("hero_subtitle", "Hero Subtitle")}
      </div>
      {F("about_text", "About Text", "textarea")}
      <div className="grid gap-4 md:grid-cols-3">
        {F("phone", "Phone")}
        {F("email", "Email")}
        {F("whatsapp", "WhatsApp")}
        {F("instagram", "Instagram URL")}
        {F("facebook", "Facebook URL")}
        {F("address", "Address")}
        {F("city", "City")}
        {F("delivery_radius_km", "Delivery Radius (km)", "number")}
        {F("free_delivery_above", "Free Delivery Above (₹)", "number")}
        {F("delivery_charge", "Delivery Charge (₹)", "number")}
      </div>
      <Button onClick={save} className="bg-primary"><Save className="mr-2 h-4 w-4" /> Save Settings</Button>
    </div>
  );
}

function emptyProduct(): Partial<Product> {
  return { slug: "", name: "", brand: "", category_slug: "cement", price: 0, unit: "unit", min_order: 1,
    image_url: "", rating: 4.5, description: "", specs: [], in_stock: true, active: true, sort_order: 0 };
}

function ProductsTab() {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [specsText, setSpecsText] = useState("");

  const startEdit = (p?: Product) => {
    const init = p ?? emptyProduct();
    setEditing(init);
    setSpecsText(JSON.stringify(init.specs ?? [], null, 2));
  };

  const save = async () => {
    if (!editing) return;
    let specs: { label: string; value: string }[] = [];
    try { specs = JSON.parse(specsText || "[]"); } catch { toast.error("Specs must be valid JSON"); return; }
    const payload: Record<string, unknown> = {
      slug: editing.slug, name: editing.name, brand: editing.brand, category_slug: editing.category_slug,
      price: Number(editing.price), unit: editing.unit, min_order: Number(editing.min_order),
      image_url: editing.image_url, rating: Number(editing.rating ?? 4.5), description: editing.description,
      specs, in_stock: editing.in_stock, active: editing.active, sort_order: Number(editing.sort_order ?? 0),
    };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["products"] }); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["products"] }); }
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => startEdit()} className="bg-primary"><Plus className="mr-2 h-4 w-4" /> Add Product</Button>

      {editing && (
        <div className="space-y-4 rounded-lg border border-primary/40 bg-card p-6">
          <h3 className="text-lg font-bold">{editing.id ? "Edit" : "New"} Product</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Name</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Slug (url-friendly)</Label><Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
            <div className="space-y-2"><Label>Brand</Label><Input value={editing.brand ?? ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={editing.category_slug} onValueChange={(v) => setEditing({ ...editing, category_slug: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Price (₹)</Label><Input type="number" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Unit</Label><Input value={editing.unit ?? ""} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} /></div>
            <div className="space-y-2"><Label>Min Order</Label><Input type="number" value={editing.min_order ?? 1} onChange={(e) => setEditing({ ...editing, min_order: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Rating</Label><Input type="number" step="0.1" value={editing.rating ?? 4.5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Image URL (e.g. /products/product-cement-opc.jpg or full https URL)</Label><Input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Specs (JSON array of {`{label, value}`})</Label><Textarea rows={6} value={specsText} onChange={(e) => setSpecsText(e.target.value)} /></div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.in_stock ?? true} onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })} /> In stock</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="bg-primary"><Save className="mr-2 h-4 w-4" /> Save</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3"><img src={imageUrl(p.image_url)} className="h-12 w-12 rounded object-cover" alt="" /></td>
                <td className="p-3 font-bold">{p.name}<div className="text-xs text-muted-foreground">{p.brand}</div></td>
                <td className="p-3">{p.category_slug}</td>
                <td className="p-3">{formatINR(Number(p.price))}</td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(p)}><Edit3 className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => del(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<(Order & { order_items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setOrders((data ?? []) as unknown as (Order & { order_items: OrderItem[] })[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Status updated"); load(); }
  };

  if (loading) return <div className="text-muted-foreground">Loading…</div>;
  if (orders.length === 0) return <div className="rounded-lg border border-border bg-card p-12 text-center text-muted-foreground">No orders yet.</div>;

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="text-lg font-black text-primary">{o.order_number}</div>
              <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</div>
              <div className="mt-1 text-sm">{o.full_name} · {o.phone} · {o.email}</div>
              <div className="text-xs text-muted-foreground">{o.address}, {o.city} – {o.pincode}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black">{formatINR(Number(o.total))}</div>
              <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                <SelectTrigger className="mt-2 w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["pending","confirmed","out_for_delivery","delivered","cancelled"].map((s) => <SelectItem key={s} value={s}>{s.replace("_"," ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-3 space-y-1 text-sm">
            {o.order_items.map((it) => (
              <div key={it.id} className="flex justify-between">
                <span>{it.product_name} × {it.quantity}</span>
                <span className="font-bold">{formatINR(Number(it.subtotal))}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TestimonialsTab() {
  const { data: testimonials = [] } = useTestimonials();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

  const startEdit = (t?: Testimonial) => setEditing(t ?? { author_name: "", author_role: "", content: "", rating: 5, approved: true, sort_order: 0 });

  const save = async () => {
    if (!editing) return;
    const payload = { author_name: editing.author_name, author_role: editing.author_role, content: editing.content,
      rating: Number(editing.rating ?? 5), approved: editing.approved ?? true, sort_order: Number(editing.sort_order ?? 0) };
    const { error } = editing.id
      ? await supabase.from("testimonials").update(payload).eq("id", editing.id)
      : await supabase.from("testimonials").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["testimonials"] }); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["testimonials"] }); }
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => startEdit()} className="bg-primary"><Plus className="mr-2 h-4 w-4" /> Add Testimonial</Button>
      {editing && (
        <div className="space-y-4 rounded-lg border border-primary/40 bg-card p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Author Name</Label><Input value={editing.author_name ?? ""} onChange={(e) => setEditing({ ...editing, author_name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Role / Location</Label><Input value={editing.author_role ?? ""} onChange={(e) => setEditing({ ...editing, author_role: e.target.value })} /></div>
            <div className="space-y-2"><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Content</Label><Textarea value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
          </div>
          <div className="flex gap-2"><Button onClick={save} className="bg-primary"><Save className="mr-2 h-4 w-4" /> Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-lg border border-border bg-card p-5">
            <div className="text-sm">"{t.content}"</div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div><div className="font-bold">{t.author_name}</div><div className="text-xs text-muted-foreground">{t.author_role}</div></div>
              <div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => startEdit(t)}><Edit3 className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => del(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesTab() {
  const { data: categories = [] } = useCategories();
  const qc = useQueryClient();
  const [form, setForm] = useState({ slug: "", name: "", description: "" });

  const add = async () => {
    if (!form.slug || !form.name) return toast.error("Slug & name required");
    const { error } = await supabase.from("categories").insert({ ...form, sort_order: categories.length + 1 });
    if (error) toast.error(error.message);
    else { toast.success("Added"); setForm({ slug: "", name: "", description: "" }); qc.invalidateQueries({ queryKey: ["categories"] }); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete category? Products in it won't be deleted but will be orphaned.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["categories"] }); }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border border-border bg-card p-6 md:grid-cols-4">
        <Input placeholder="slug (e.g. paint)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Button onClick={add} className="bg-primary"><Plus className="mr-2 h-4 w-4" /> Add</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div><div className="font-bold">{c.name}</div><div className="text-xs text-muted-foreground">{c.slug} · {c.description}</div></div>
            <Button size="sm" variant="ghost" onClick={() => del(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
