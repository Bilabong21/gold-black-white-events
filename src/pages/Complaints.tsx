import { useState } from "react";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquareWarning, Send } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({
  full_name: z.string().trim().min(2, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Subject required").max(150),
  category: z.string().min(1),
  message: z.string().trim().min(10, "Please describe your complaint (min 10 chars)").max(2000),
  branch_id: z.string().optional(),
  group_id: z.string().optional(),
});

const CATEGORIES = ["General", "Leadership", "Events", "Finance", "Conduct", "Facilities", "Other"];

const Complaints = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    category: "General",
    message: "",
    branch_id: "",
    group_id: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { data: branches = [] } = useQuery({
    queryKey: ["public-branches-min"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("branches").select("id,name,province").order("name");
      if (error) throw error;
      return data as { id: string; name: string; province: string }[];
    },
  });

  const { data: groups = [] } = useQuery({
    queryKey: ["public-groups-min"],
    queryFn: async () => {
      const { data, error } = await supabase.from("church_groups").select("id,name").order("name");
      if (error) throw error;
      return data as { id: string; name: string }[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }
    setSubmitting(true);
    const payload: any = {
      ...parsed.data,
      phone: form.phone || null,
      branch_id: form.branch_id || null,
      group_id: form.group_id || null,
      user_id: user?.id || null,
    };
    const { error } = await (supabase as any).from("complaints").insert(payload);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Complaint submitted. Admin will review it shortly.");
    setForm({ full_name: "", email: "", phone: "", subject: "", category: "General", message: "", branch_id: "", group_id: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative bg-secondary text-secondary-foreground py-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <MessageSquareWarning className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Confidential</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Submit a <span className="text-primary">Complaint</span>
          </h1>
          <p className="text-secondary-foreground/80">
            Share your concerns. All complaints are read by BRCSA administrators.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Complaint Form</CardTitle>
              <CardDescription>Fields marked * are required.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input maxLength={100} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input maxLength={30} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Related Branch</Label>
                    <Select value={form.branch_id || "none"} onValueChange={(v) => setForm({ ...form, branch_id: v === "none" ? "" : v })}>
                      <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— None —</SelectItem>
                        {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name} ({b.province})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Related Group</Label>
                    <Select value={form.group_id || "none"} onValueChange={(v) => setForm({ ...form, group_id: v === "none" ? "" : v })}>
                      <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— None —</SelectItem>
                        {groups.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input maxLength={150} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Describe your complaint *</Label>
                  <Textarea rows={6} maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  <p className="text-xs text-muted-foreground text-right">{form.message.length}/2000</p>
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Send className="h-4 w-4 mr-2" />{submitting ? "Submitting…" : "Submit Complaint"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Complaints;
