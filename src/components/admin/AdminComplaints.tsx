import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquareWarning, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Complaint = {
  id: string; full_name: string; email: string; phone: string | null;
  subject: string; category: string; message: string; status: string;
  created_at: string; branch_id: string | null; group_id: string | null;
};

const STATUSES = ["open", "in_review", "resolved", "dismissed"];

const statusColor: Record<string, string> = {
  open: "bg-yellow-500/20 text-yellow-700 border-yellow-500/40",
  in_review: "bg-blue-500/20 text-blue-700 border-blue-500/40",
  resolved: "bg-green-500/20 text-green-700 border-green-500/40",
  dismissed: "bg-muted text-muted-foreground border-border",
};

const AdminComplaints = () => {
  const qc = useQueryClient();
  const [viewing, setViewing] = useState<Complaint | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const { data: complaints = [] } = useQuery({
    queryKey: ["admin-complaints"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("complaints").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Complaint[];
    },
  });

  const statusMut = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await (supabase as any).from("complaints").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-complaints"] }); toast.success("Status updated"); },
    onError: (e: any) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("complaints").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-complaints"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = filter === "all" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      <Card className="bg-card border-primary/20 shadow-lg">
        <CardContent className="pt-6 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <MessageSquareWarning className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-bold text-foreground">Complaints ({complaints.length})</h3>
              <p className="text-sm text-muted-foreground">Review and act on submissions from members and visitors</p>
            </div>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="bg-card border-primary/20 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="text-secondary-foreground">Subject</TableHead>
                <TableHead className="text-secondary-foreground">From</TableHead>
                <TableHead className="text-secondary-foreground">Category</TableHead>
                <TableHead className="text-secondary-foreground">Status</TableHead>
                <TableHead className="text-secondary-foreground">Date</TableHead>
                <TableHead className="text-secondary-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium max-w-xs truncate">{c.subject}</TableCell>
                  <TableCell className="text-sm">
                    <div>{c.full_name}</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                  <TableCell>
                    <Select value={c.status} onValueChange={(v) => statusMut.mutate({ id: c.id, status: v })}>
                      <SelectTrigger className={`w-32 ${statusColor[c.status] || ""}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10" onClick={() => setViewing(c)}><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => { if (confirm("Delete this complaint?")) delMut.mutate(c.id); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No complaints</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle>{viewing?.subject}</DialogTitle>
            <DialogDescription>
              From {viewing?.full_name} · {viewing?.email}{viewing?.phone ? ` · ${viewing.phone}` : ""}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Badge variant="outline">{viewing.category}</Badge>
                <Badge className={statusColor[viewing.status]}>{viewing.status}</Badge>
              </div>
              <p className="text-sm text-card-foreground whitespace-pre-wrap border-l-2 border-primary pl-3">{viewing.message}</p>
              <p className="text-xs text-muted-foreground">Submitted {new Date(viewing.created_at).toLocaleString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminComplaints;
