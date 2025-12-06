
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  Crown,
  UserPlus,
  Search,
  Filter,
  Home,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

// Church group categories
const churchCategories = [
  { id: 'pec-fs-nc', name: 'PEC for FS/NC' },
  { id: 'pec-gp-nw', name: 'PEC for GP/NW' },
  { id: 'cec', name: 'CEC' },
  { id: 'nec-synod', name: 'NEC SYNOD' },
  { id: 'nec-mca', name: 'NEC MCA' },
  { id: 'nec-cm', name: 'NEC CM' },
  { id: 'nec-cca', name: 'NEC CCA' },
  { id: 'nec-yca-ymwca', name: 'NEC YCA/YMWCA' }
];

const positions = [
  'Chairperson',
  'Deputy Chairperson',
  'Secretary',
  'Deputy Secretary',
  'Treasurer',
  'Deputy Treasurer',
  'Additional Member'
];

const provinces = ['NC', 'FS', 'NW', 'GP'];

interface CommitteeMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  category: string;
  branch: string;
  province: string;
  picture: string;
}

// Initial mock data
const initialMembers: CommitteeMember[] = [
  {
    id: '1',
    name: 'Rev. Thabo Mthembu',
    email: 'thabo.mthembu@brcsa.org',
    phone: '+27 51 123 4567',
    position: 'Chairperson',
    category: 'pec-fs-nc',
    branch: 'BRCSA Bloemfontein Central',
    province: 'FS',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Mrs. Sarah Molefe',
    email: 'sarah.molefe@brcsa.org',
    phone: '+27 53 234 5678',
    position: 'Deputy Chairperson',
    category: 'pec-fs-nc',
    branch: 'BRCSA Kimberley North',
    province: 'NC',
    picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b510?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Mr. David Mashaba',
    email: 'david.mashaba@brcsa.org',
    phone: '+27 11 123 4567',
    position: 'Chairperson',
    category: 'pec-gp-nw',
    branch: 'BRCSA Johannesburg Central',
    province: 'GP',
    picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'Ms. Grace Nkomo',
    email: 'grace.nkomo@brcsa.org',
    phone: '+27 18 234 5678',
    position: 'Secretary',
    category: 'pec-gp-nw',
    branch: 'BRCSA Mahikeng',
    province: 'NW',
    picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
];

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState<CommitteeMember[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterProvince, setFilterProvince] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [newMember, setNewMember] = useState<Partial<CommitteeMember>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    category: '',
    branch: '',
    province: '',
    picture: ''
  });

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userEmail = localStorage.getItem('userEmail') || '';
    
    if (authStatus !== 'true') {
      navigate('/login');
      return;
    }
    
    setIsAuthenticated(true);
    
    if (!userEmail.toLowerCase().includes('admin')) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/groups');
      return;
    }
    
    setIsAdmin(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || member.category === filterCategory;
    const matchesProvince = filterProvince === 'all' || member.province === filterProvince;
    return matchesSearch && matchesCategory && matchesProvince;
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.position || !newMember.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const member: CommitteeMember = {
      id: Date.now().toString(),
      name: newMember.name || '',
      email: newMember.email || '',
      phone: newMember.phone || '',
      position: newMember.position || '',
      category: newMember.category || '',
      branch: newMember.branch || '',
      province: newMember.province || '',
      picture: newMember.picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    };

    setMembers(prev => [...prev, member]);
    setNewMember({
      name: '',
      email: '',
      phone: '',
      position: '',
      category: '',
      branch: '',
      province: '',
      picture: ''
    });
    setIsAddDialogOpen(false);
    toast.success('Committee member added successfully!');
  };

  const handleEditMember = () => {
    if (!editingMember) return;

    setMembers(prev => prev.map(m => m.id === editingMember.id ? editingMember : m));
    setIsEditDialogOpen(false);
    setEditingMember(null);
    toast.success('Committee member updated successfully!');
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success('Committee member removed successfully!');
  };

  const getCategoryName = (categoryId: string) => {
    return churchCategories.find(c => c.id === categoryId)?.name || categoryId;
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Admin Header - Separate from church app */}
      <header className="bg-secondary border-b-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-foreground">BRCSA Admin</h1>
                <p className="text-xs text-secondary-foreground/60">Committee Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-secondary-foreground hover:bg-primary/10">
                  <Home className="h-4 w-4 mr-2" />
                  Main Site
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-secondary-foreground hover:bg-primary/10">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-secondary to-background py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
              <Crown className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-secondary-foreground">
                Admin <span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-secondary-foreground/70 text-lg">
                Manage committee members across all church categories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls Bar */}
          <Card className="mb-6 bg-card border-primary/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-border focus:border-primary"
                    />
                  </div>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48 border-border">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {churchCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterProvince} onValueChange={setFilterProvince}>
                    <SelectTrigger className="w-40 border-border">
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Provinces</SelectItem>
                      {provinces.map((prov) => (
                        <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-card">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-card-foreground">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Add Committee Member
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Add a new member to a church committee
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Full Name *</Label>
                        <Input
                          value={newMember.name}
                          onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Rev. John Doe"
                          className="border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Email *</Label>
                        <Input
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="email@brcsa.org"
                          className="border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Phone</Label>
                        <Input
                          value={newMember.phone}
                          onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+27 xx xxx xxxx"
                          className="border-border focus:border-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-foreground">Category *</Label>
                          <Select 
                            value={newMember.category} 
                            onValueChange={(value) => setNewMember(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="border-border">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {churchCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground">Position *</Label>
                          <Select 
                            value={newMember.position} 
                            onValueChange={(value) => setNewMember(prev => ({ ...prev, position: value }))}
                          >
                            <SelectTrigger className="border-border">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {positions.map((pos) => (
                                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-foreground">Province</Label>
                          <Select 
                            value={newMember.province} 
                            onValueChange={(value) => setNewMember(prev => ({ ...prev, province: value }))}
                          >
                            <SelectTrigger className="border-border">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((prov) => (
                                <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground">Branch</Label>
                          <Input
                            value={newMember.branch}
                            onChange={(e) => setNewMember(prev => ({ ...prev, branch: e.target.value }))}
                            placeholder="BRCSA ..."
                            className="border-border focus:border-primary"
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddMember} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-2 border-primary/30 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary">{members.length}</div>
                <div className="text-muted-foreground text-sm mt-1">Total Members</div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-card-foreground">{churchCategories.length}</div>
                <div className="text-muted-foreground text-sm mt-1">Categories</div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-card-foreground">{provinces.length}</div>
                <div className="text-muted-foreground text-sm mt-1">Provinces</div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-card-foreground">{filteredMembers.length}</div>
                <div className="text-muted-foreground text-sm mt-1">Filtered Results</div>
              </CardContent>
            </Card>
          </div>

          {/* Members Table */}
          <Card className="bg-card border-primary/20 shadow-xl">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Crown className="h-5 w-5 text-primary" />
                Committee Members
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage all committee members across church categories
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                      <TableHead className="text-muted-foreground">Member</TableHead>
                      <TableHead className="text-muted-foreground">Position</TableHead>
                      <TableHead className="text-muted-foreground">Category</TableHead>
                      <TableHead className="text-muted-foreground">Province</TableHead>
                      <TableHead className="text-muted-foreground">Branch</TableHead>
                      <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id} className="border-border hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="border-2 border-primary/30">
                              <AvatarImage src={member.picture} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-card-foreground">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5">
                            {member.position}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-card-foreground">{getCategoryName(member.category)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-secondary text-secondary-foreground border border-border">
                            {member.province}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground text-sm">{member.branch}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog open={isEditDialogOpen && editingMember?.id === member.id} onOpenChange={(open) => {
                              setIsEditDialogOpen(open);
                              if (!open) setEditingMember(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingMember(member)}
                                  className="text-primary hover:bg-primary/10"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md bg-card">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2 text-card-foreground">
                                    <Pencil className="h-5 w-5 text-primary" />
                                    Edit Committee Member
                                  </DialogTitle>
                                </DialogHeader>
                                {editingMember && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label className="text-foreground">Full Name *</Label>
                                      <Input
                                        value={editingMember.name}
                                        onChange={(e) => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                                        className="border-border focus:border-primary"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-foreground">Email *</Label>
                                      <Input
                                        type="email"
                                        value={editingMember.email}
                                        onChange={(e) => setEditingMember(prev => prev ? { ...prev, email: e.target.value } : null)}
                                        className="border-border focus:border-primary"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-foreground">Phone</Label>
                                      <Input
                                        value={editingMember.phone}
                                        onChange={(e) => setEditingMember(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                        className="border-border focus:border-primary"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-foreground">Category</Label>
                                        <Select 
                                          value={editingMember.category} 
                                          onValueChange={(value) => setEditingMember(prev => prev ? { ...prev, category: value } : null)}
                                        >
                                          <SelectTrigger className="border-border">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {churchCategories.map((cat) => (
                                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-foreground">Position</Label>
                                        <Select 
                                          value={editingMember.position} 
                                          onValueChange={(value) => setEditingMember(prev => prev ? { ...prev, position: value } : null)}
                                        >
                                          <SelectTrigger className="border-border">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {positions.map((pos) => (
                                              <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-foreground">Province</Label>
                                        <Select 
                                          value={editingMember.province} 
                                          onValueChange={(value) => setEditingMember(prev => prev ? { ...prev, province: value } : null)}
                                        >
                                          <SelectTrigger className="border-border">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {provinces.map((prov) => (
                                              <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-foreground">Branch</Label>
                                        <Input
                                          value={editingMember.branch}
                                          onChange={(e) => setEditingMember(prev => prev ? { ...prev, branch: e.target.value } : null)}
                                          className="border-border focus:border-primary"
                                        />
                                      </div>
                                    </div>
                                    <Button onClick={handleEditMember} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                      Save Changes
                                    </Button>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMember(member.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">No Members Found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Admin Footer */}
      <footer className="bg-secondary border-t border-primary/20 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-secondary-foreground/60 text-sm">
            BRCSA Admin Panel &copy; {new Date().getFullYear()} - Committee Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
