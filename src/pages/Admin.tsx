import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Pencil, Trash2, Crown, UserPlus, Search, Filter, Home, LogOut, BarChart3, CalendarDays, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminMemberForm, { positions, provinces, ministryCategories } from "@/components/admin/AdminMemberForm";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminEventModeration from "@/components/admin/AdminEventModeration";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterProvince, setFilterProvince] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', position: '', group_id: '', ministry_category: '', branch: '', province: '', picture_url: '' });

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (!loading && user && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/groups');
    }
  }, [user, loading, isAdmin, navigate]);

  const { data: groups = [] } = useQuery({
    queryKey: ['church-groups'],
    queryFn: async () => {
      const { data, error } = await supabase.from('church_groups').select('*').order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: members = [] } = useQuery({
    queryKey: ['committee-members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('committee_members').select('*, church_groups(name)').order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const { data: pendingUsers = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('status', 'pending');
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  const addMutation = useMutation({
    mutationFn: async (member: typeof newMember) => {
      const { error } = await supabase.from('committee_members').insert({
        name: member.name, email: member.email, phone: member.phone, position: member.position,
        group_id: member.group_id || null, ministry_category: (member.ministry_category as any) || null,
        branch: member.branch, province: member.province, picture_url: member.picture_url,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committee-members'] });
      setIsAddDialogOpen(false);
      setNewMember({ name: '', email: '', phone: '', position: '', group_id: '', ministry_category: '', branch: '', province: '', picture_url: '' });
      toast.success('Member added successfully!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (member: any) => {
      const { error } = await supabase.from('committee_members').update({
        name: member.name, email: member.email, phone: member.phone, position: member.position,
        group_id: member.group_id || null, ministry_category: member.ministry_category || null,
        branch: member.branch, province: member.province, picture_url: member.picture_url,
      }).eq('id', member.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committee-members'] });
      setIsEditDialogOpen(false);
      setEditingMember(null);
      toast.success('Member updated!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('committee_members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committee-members'] });
      toast.success('Member removed!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const filteredMembers = members.filter((m: any) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || (m.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === 'all' || m.group_id === filterGroup;
    const matchesProvince = filterProvince === 'all' || m.province === filterProvince;
    const matchesCategory = filterCategory === 'all' || m.ministry_category === filterCategory;
    return matchesSearch && matchesGroup && matchesProvince && matchesCategory;
  });

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-secondary border-b-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-foreground">BRCSA Admin</h1>
                <p className="text-xs text-secondary-foreground/60">Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {pendingUsers.length > 0 && (
                <Badge className="bg-yellow-500 text-yellow-950 animate-pulse">{pendingUsers.length} pending</Badge>
              )}
              <Link to="/"><Button variant="ghost" size="sm" className="text-secondary-foreground hover:bg-primary/10"><Home className="h-4 w-4 mr-2" />Main Site</Button></Link>
              <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/login'); }} className="text-secondary-foreground hover:bg-primary/10"><LogOut className="h-4 w-4 mr-2" />Logout</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary via-secondary to-background py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20"><Crown className="h-10 w-10 text-primary" /></div>
            <div>
              <h1 className="text-3xl font-bold text-secondary-foreground">Admin <span className="text-primary">Dashboard</span></h1>
              <p className="text-secondary-foreground/70">Manage users, members, events, and view analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Content */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="bg-card border border-primary/20 p-1">
              <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <UserCheck className="h-4 w-4" />Users
              </TabsTrigger>
              <TabsTrigger value="members" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <Users className="h-4 w-4" />Members
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <CalendarDays className="h-4 w-4" />Events
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <BarChart3 className="h-4 w-4" />Analytics
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <AdminUserManagement />
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <div className="space-y-6">
                <Card className="bg-card border-primary/20 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                      <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                        </div>
                        <Select value={filterGroup} onValueChange={setFilterGroup}>
                          <SelectTrigger className="w-48"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Group" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Groups</SelectItem>
                            {groups.map((g: any) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                          <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {ministryCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Select value={filterProvince} onValueChange={setFilterProvince}>
                          <SelectTrigger className="w-36"><SelectValue placeholder="Province" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><UserPlus className="h-4 w-4 mr-2" />Add Member</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-card">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />Add Committee Member</DialogTitle>
                            <DialogDescription>Add a new member to a church committee</DialogDescription>
                          </DialogHeader>
                          <AdminMemberForm data={newMember} onChange={setNewMember} onSubmit={() => addMutation.mutate(newMember)} submitLabel="Add Member" groups={groups} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-primary/20 shadow-lg">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-secondary hover:bg-secondary">
                          <TableHead className="text-secondary-foreground">Member</TableHead>
                          <TableHead className="text-secondary-foreground">Position</TableHead>
                          <TableHead className="text-secondary-foreground">Group</TableHead>
                          <TableHead className="text-secondary-foreground">Category</TableHead>
                          <TableHead className="text-secondary-foreground">Province</TableHead>
                          <TableHead className="text-secondary-foreground text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.map((member: any) => (
                          <TableRow key={member.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-primary">
                                  <AvatarImage src={member.picture_url || ''} />
                                  <AvatarFallback className="bg-primary/10 text-primary">{member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-foreground">{member.name}</p>
                                  <p className="text-xs text-muted-foreground">{member.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell><Badge variant="outline" className="border-primary text-primary">{member.position}</Badge></TableCell>
                            <TableCell className="text-muted-foreground">{member.church_groups?.name || '—'}</TableCell>
                            <TableCell>{member.ministry_category && <Badge className="bg-accent text-accent-foreground">{member.ministry_category}</Badge>}</TableCell>
                            <TableCell><Badge variant="secondary">{member.province || '—'}</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10" onClick={() => { setEditingMember({ ...member }); setIsEditDialogOpen(true); }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate(member.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredMembers.length === 0 && (
                          <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No members found</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <AdminEventModeration />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <AdminAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Pencil className="h-5 w-5 text-primary" />Edit Member</DialogTitle>
            <DialogDescription>Update committee member details</DialogDescription>
          </DialogHeader>
          {editingMember && <AdminMemberForm data={editingMember} onChange={setEditingMember} onSubmit={() => updateMutation.mutate(editingMember)} submitLabel="Save Changes" groups={groups} />}
        </DialogContent>
      </Dialog>

      <footer className="bg-secondary border-t-4 border-primary py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-secondary-foreground/60 text-sm">© {new Date().getFullYear()} BRCSA Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
