import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft,
  Crown,
  UserPlus,
  Search,
  Filter
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    
    // Check if user is admin (has 'admin' in email)
    if (!userEmail.toLowerCase().includes('admin')) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/groups');
      return;
    }
    
    setIsAdmin(true);
  }, [navigate]);

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
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate('/groups')}
            className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </button>
          <div className="flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">
                Admin <span className="text-primary">Panel</span>
              </h1>
              <p className="text-secondary-foreground/70">
                Manage committee members across all church categories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls Bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
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
                    <SelectTrigger className="w-40">
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
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Add Committee Member
                      </DialogTitle>
                      <DialogDescription>
                        Add a new member to a church committee
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                          value={newMember.name}
                          onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Rev. John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="email@brcsa.org"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={newMember.phone}
                          onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+27 xx xxx xxxx"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category *</Label>
                          <Select 
                            value={newMember.category} 
                            onValueChange={(value) => setNewMember(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
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
                          <Label>Position *</Label>
                          <Select 
                            value={newMember.position} 
                            onValueChange={(value) => setNewMember(prev => ({ ...prev, position: value }))}
                          >
                            <SelectTrigger>
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
                          <Label>Province</Label>
                          <Select 
                            value={newMember.province} 
                            onValueChange={(value) => setNewMember(prev => ({ ...prev, province: value }))}
                          >
                            <SelectTrigger>
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
                          <Label>Branch</Label>
                          <Input
                            value={newMember.branch}
                            onChange={(e) => setNewMember(prev => ({ ...prev, branch: e.target.value }))}
                            placeholder="BRCSA ..."
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddMember} className="w-full bg-primary text-primary-foreground">
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
            <Card className="bg-card border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{members.length}</div>
                <div className="text-muted-foreground text-sm">Total Members</div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-foreground">{churchCategories.length}</div>
                <div className="text-muted-foreground text-sm">Categories</div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-foreground">{provinces.length}</div>
                <div className="text-muted-foreground text-sm">Provinces</div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-foreground">{filteredMembers.length}</div>
                <div className="text-muted-foreground text-sm">Filtered Results</div>
              </CardContent>
            </Card>
          </div>

          {/* Members Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Committee Members
              </CardTitle>
              <CardDescription>
                Manage all committee members across church categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Member</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Province</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarImage src={member.picture} alt={member.name} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              {member.position}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{getCategoryName(member.category)}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{member.province}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {member.branch}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingMember(member);
                                  setIsEditDialogOpen(true);
                                }}
                                className="hover:bg-primary/10 hover:text-primary"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteMember(member.id)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          No members found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Edit Committee Member
            </DialogTitle>
            <DialogDescription>
              Update member information
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editingMember.name}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, email: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={editingMember.phone}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, phone: e.target.value } : null)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={editingMember.category} 
                    onValueChange={(value) => setEditingMember(prev => prev ? { ...prev, category: value } : null)}
                  >
                    <SelectTrigger>
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
                  <Label>Position</Label>
                  <Select 
                    value={editingMember.position} 
                    onValueChange={(value) => setEditingMember(prev => prev ? { ...prev, position: value } : null)}
                  >
                    <SelectTrigger>
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
                  <Label>Province</Label>
                  <Select 
                    value={editingMember.province} 
                    onValueChange={(value) => setEditingMember(prev => prev ? { ...prev, province: value } : null)}
                  >
                    <SelectTrigger>
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
                  <Label>Branch</Label>
                  <Input
                    value={editingMember.branch}
                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, branch: e.target.value } : null)}
                  />
                </div>
              </div>
              <Button onClick={handleEditMember} className="w-full bg-primary text-primary-foreground">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Admin;
