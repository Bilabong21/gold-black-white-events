import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash2, CalendarDays, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminEventModeration = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: events = [] } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, church_groups(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('events').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast.success(`Event marked as ${status}!`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast.success('Event removed!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const filtered = events.filter((e: any) => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'completed': return 'bg-muted text-muted-foreground border-muted';
      default: return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
                <TableHead className="text-secondary-foreground">Event</TableHead>
                <TableHead className="text-secondary-foreground">Group</TableHead>
                <TableHead className="text-secondary-foreground">Date</TableHead>
                <TableHead className="text-secondary-foreground">Location</TableHead>
                <TableHead className="text-secondary-foreground">Status</TableHead>
                <TableHead className="text-secondary-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((event: any) => (
                <TableRow key={event.id} className="hover:bg-muted/50">
                  <TableCell>
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{event.description}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{event.church_groups?.name || '—'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(event.event_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[120px]">{event.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor(event.status)}>{event.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {event.status === 'cancelled' ? (
                        <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-500/10"
                          onClick={() => updateStatusMutation.mutate({ id: event.id, status: 'upcoming' })}>
                          Restore
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-orange-600 hover:bg-orange-500/10"
                          onClick={() => updateStatusMutation.mutate({ id: event.id, status: 'cancelled' })}>
                          Cancel
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteMutation.mutate(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No events found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEventModeration;
