import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, CheckCircle, XCircle, Ban } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminUserManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      toast.success(`User ${status} successfully!`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const filtered = profiles.filter((p: any) => {
    const matchesSearch = `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone || '').includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'cancelled': return 'bg-orange-500/10 text-orange-600 border-orange-500/30';
      default: return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
    }
  };

  const pendingCount = profiles.filter((p: any) => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      {pendingCount > 0 && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
            <span className="font-medium text-foreground">{pendingCount} pending registration(s) awaiting approval</span>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-primary/20 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="text-secondary-foreground">Name</TableHead>
                <TableHead className="text-secondary-foreground">Phone</TableHead>
                <TableHead className="text-secondary-foreground">Status</TableHead>
                <TableHead className="text-secondary-foreground">Registered</TableHead>
                <TableHead className="text-secondary-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((profile: any) => (
                <TableRow key={profile.id} className="hover:bg-muted/50">
                  <TableCell>
                    <p className="font-medium text-foreground">{profile.first_name} {profile.last_name}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{profile.phone || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor(profile.status)}>{profile.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {profile.status !== 'approved' && (
                        <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-500/10"
                          onClick={() => updateStatusMutation.mutate({ userId: profile.user_id, status: 'approved' })}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {profile.status !== 'rejected' && (
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-500/10"
                          onClick={() => updateStatusMutation.mutate({ userId: profile.user_id, status: 'rejected' })}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {profile.status !== 'cancelled' && (
                        <Button size="sm" variant="ghost" className="text-orange-600 hover:bg-orange-500/10"
                          onClick={() => updateStatusMutation.mutate({ userId: profile.user_id, status: 'cancelled' })}>
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No users found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
