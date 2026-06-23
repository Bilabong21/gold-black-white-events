import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const provinces = ["GP", "NW", "FS", "NC"] as const;
const PROVINCE_NAMES: Record<string, string> = { GP: "Gauteng", NW: "North West", FS: "Free State", NC: "Northern Cape" };

type Branch = { id: string; name: string; city: string | null; province: string };

const empty = { name: "", city: "", province: "" };

const AdminBranchManagement = () => {
  const qc = useQueryClient();
  const [isAdd, setIsAdd] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [form, setForm] = useState<{ name: string; city: string; province: string }>(empty);

  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("branches").select("*").order("province").order("name");
      if (error) throw error;
      return data as Branch[];
    },
  });

  const addMut = useMutation({
    mutationFn: async (b: typeof form) => {
      const { error } = await (supabase as any).from("branches").insert({ name: b.name, city: b.city || null, province: b.province });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["branches"] }); setIsAdd(false); setForm(empty); toast.success("Branch added"); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: async (b: Branch) => {
      const { error } = await (supabase as any).from("branches").update({ name: b.name, city: b.city, province: b.province }).eq("id", b.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["branches"] }); setEditing(null); toast.success("Branch updated"); },
    onError: (e: any) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("branches").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["branches"] }); toast.success("Branch removed"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <Card className="bg-card border-primary/20 shadow-lg">
        <CardContent className="pt-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-bold text-foreground">Branches ({branches.length})</h3>
              <p className="text-sm text-muted-foreground">Manage BRCSA branches across provinces</p>
            </div>
          </div>
          <Dialog open={isAdd} onOpenChange={setIsAdd}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4 mr-2" />Add Branch</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card">
              <DialogHeader>
                <DialogTitle>Add Branch</DialogTitle>
                <DialogDescription>Create a new BRCSA branch</DialogDescription>
              </DialogHeader>
              <BranchFields data={form} onChange={setForm} />
              <Button onClick={() => addMut.mutate(form)} disabled={!form.name || !form.province} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Add</Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="bg-card border-primary/20 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="text-secondary-foreground">Branch</TableHead>
                <TableHead className="text-secondary-foreground">City</TableHead>
                <TableHead className="text-secondary-foreground">Province</TableHead>
                <TableHead className="text-secondary-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((b) => (
                <TableRow key={b.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-muted-foreground">{b.city || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className="border-primary text-primary">{b.province} · {PROVINCE_NAMES[b.province]}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10" onClick={() => setEditing({ ...b })}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => { if (confirm(`Delete ${b.name}?`)) delMut.mutate(b.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {branches.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No branches yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>Update branch details</DialogDescription>
          </DialogHeader>
          {editing && (
            <>
              <BranchFields data={{ name: editing.name, city: editing.city || "", province: editing.province }} onChange={(v) => setEditing({ ...editing, ...v })} />
              <Button onClick={() => editing && updateMut.mutate(editing)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const BranchFields = ({ data, onChange }: { data: { name: string; city: string; province: string }; onChange: (v: any) => void }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Branch Name *</Label>
      <Input value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} placeholder="e.g., Soweto" />
    </div>
    <div className="space-y-2">
      <Label>City</Label>
      <Input value={data.city} onChange={(e) => onChange({ ...data, city: e.target.value })} placeholder="e.g., Johannesburg" />
    </div>
    <div className="space-y-2">
      <Label>Province *</Label>
      <Select value={data.province} onValueChange={(v) => onChange({ ...data, province: v })}>
        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          {provinces.map((p) => <SelectItem key={p} value={p}>{p} — {PROVINCE_NAMES[p]}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default AdminBranchManagement;
