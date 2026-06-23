import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Pencil, Trash2, Crown } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PROVINCES = ["GP", "NW", "FS", "NC"];

type Group = {
  id: string;
  slug: string;
  name: string;
  full_name: string | null;
  description: string | null;
  provinces: string[] | null;
  established: string | null;
  contact_email: string | null;
};

const empty = { slug: "", name: "", full_name: "", description: "", provinces: [] as string[], established: "", contact_email: "" };

const AdminGroupManagement = () => {
  const qc = useQueryClient();
  const [isAdd, setIsAdd] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [form, setForm] = useState(empty);

  const { data: groups = [] } = useQuery({
    queryKey: ["admin-church-groups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("church_groups").select("*, committee_members(id)").order("name");
      if (error) throw error;
      return data as any[];
    },
  });

  const addMut = useMutation({
    mutationFn: async (g: typeof form) => {
      const { error } = await supabase.from("church_groups").insert({
        slug: g.slug, name: g.name, full_name: g.full_name || null,
        description: g.description || null, provinces: g.provinces,
        established: g.established || null, contact_email: g.contact_email || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-church-groups"] }); qc.invalidateQueries({ queryKey: ["church-groups"] }); setIsAdd(false); setForm(empty); toast.success("Group added"); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: async (g: Group) => {
      const { error } = await supabase.from("church_groups").update({
        slug: g.slug, name: g.name, full_name: g.full_name,
        description: g.description, provinces: g.provinces,
        established: g.established, contact_email: g.contact_email,
      }).eq("id", g.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-church-groups"] }); qc.invalidateQueries({ queryKey: ["church-groups"] }); setEditing(null); toast.success("Group updated"); },
    onError: (e: any) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("church_groups").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-church-groups"] }); qc.invalidateQueries({ queryKey: ["church-groups"] }); toast.success("Group removed"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <Card className="bg-card border-primary/20 shadow-lg">
        <CardContent className="pt-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-bold text-foreground">Church Groups ({groups.length})</h3>
              <p className="text-sm text-muted-foreground">Manage ministry groups and their committees</p>
            </div>
          </div>
          <Dialog open={isAdd} onOpenChange={setIsAdd}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4 mr-2" />Add Group</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-card max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Church Group</DialogTitle>
                <DialogDescription>Create a new ministry/church group</DialogDescription>
              </DialogHeader>
              <GroupFields data={form} onChange={setForm} />
              <Button onClick={() => addMut.mutate(form)} disabled={!form.slug || !form.name} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Add Group</Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="bg-card border-primary/20 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="text-secondary-foreground">Group</TableHead>
                <TableHead className="text-secondary-foreground">Provinces</TableHead>
                <TableHead className="text-secondary-foreground">Committee</TableHead>
                <TableHead className="text-secondary-foreground">Contact</TableHead>
                <TableHead className="text-secondary-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((g: any) => (
                <TableRow key={g.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.full_name || g.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(g.provinces || []).map((p: string) => <Badge key={p} variant="outline" className="border-primary text-primary">{p}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell><Badge className="bg-accent text-accent-foreground gap-1"><Crown className="h-3 w-3" />{g.committee_members?.length || 0}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{g.contact_email || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10" onClick={() => setEditing({ ...g, provinces: g.provinces || [] })}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => { if (confirm(`Delete ${g.name}? This may affect committee members.`)) delMut.mutate(g.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {groups.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No groups yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg bg-card max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>Update group details</DialogDescription>
          </DialogHeader>
          {editing && (
            <>
              <GroupFields
                data={{
                  slug: editing.slug, name: editing.name,
                  full_name: editing.full_name || "", description: editing.description || "",
                  provinces: editing.provinces || [], established: editing.established || "",
                  contact_email: editing.contact_email || "",
                }}
                onChange={(v) => setEditing({ ...editing, ...v })}
              />
              <Button onClick={() => editing && updateMut.mutate(editing)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const GroupFields = ({ data, onChange }: { data: typeof empty; onChange: (v: any) => void }) => {
  const toggleProv = (p: string) => {
    const next = data.provinces.includes(p) ? data.provinces.filter((x) => x !== p) : [...data.provinces, p];
    onChange({ ...data, provinces: next });
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Slug *</Label>
          <Input value={data.slug} onChange={(e) => onChange({ ...data, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="youth" />
        </div>
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} placeholder="Youth" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input value={data.full_name} onChange={(e) => onChange({ ...data, full_name: e.target.value })} placeholder="BRCSA Youth Ministry" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={3} />
      </div>
      <div className="space-y-2">
        <Label>Provinces</Label>
        <div className="flex flex-wrap gap-2">
          {PROVINCES.map((p) => (
            <Button key={p} type="button" size="sm" variant={data.provinces.includes(p) ? "default" : "outline"} onClick={() => toggleProv(p)} className={data.provinces.includes(p) ? "bg-primary text-primary-foreground" : "border-primary/30"}>
              {p}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Established</Label>
          <Input value={data.established} onChange={(e) => onChange({ ...data, established: e.target.value })} placeholder="1995" />
        </div>
        <div className="space-y-2">
          <Label>Contact Email</Label>
          <Input type="email" value={data.contact_email} onChange={(e) => onChange({ ...data, contact_email: e.target.value })} />
        </div>
      </div>
    </div>
  );
};

export default AdminGroupManagement;
