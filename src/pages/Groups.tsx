import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Plus, Eye, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const churchGroups = [
  {
    id: 'pec-fs-nc',
    name: 'PEC for FS/NC',
    fullName: 'Provincial Executive Committee for Free State/Northern Cape',
    description: 'Overseeing churches in the Free State and Northern Cape provinces.',
    members: 45,
    recentEvents: 3,
    provinces: ['Free State', 'Northern Cape']
  },
  {
    id: 'pec-gp-nw',
    name: 'PEC for GP/NW',
    fullName: 'Provincial Executive Committee for Gauteng/North West',
    description: 'Managing church activities in Gauteng and North West provinces.',
    members: 62,
    recentEvents: 5,
    provinces: ['Gauteng', 'North West']
  },
  {
    id: 'cec',
    name: 'CEC',
    fullName: 'Central Executive Committee',
    description: 'Central coordination and administrative oversight for NC, FS, NW and GP.',
    members: 28,
    recentEvents: 2,
    provinces: ['All Regions']
  },
  {
    id: 'nec-synod',
    name: 'NEC SYNOD',
    fullName: 'National Executive Committee Synod',
    description: 'Synod meetings and theological discussions for all regions.',
    members: 38,
    recentEvents: 4,
    provinces: ['All Regions']
  },
  {
    id: 'nec-mca',
    name: 'NEC MCA',
    fullName: 'National Executive Committee - Men\'s Christian Association',
    description: 'Men\'s ministry and fellowship activities across all provinces.',
    members: 52,
    recentEvents: 6,
    provinces: ['NC', 'FS', 'NW', 'GP']
  },
  {
    id: 'nec-cm',
    name: 'NEC CM',
    fullName: 'National Executive Committee - Christian Ministry',
    description: 'General Christian ministry coordination for all areas.',
    members: 34,
    recentEvents: 3,
    provinces: ['NC', 'FS', 'NW', 'GP']
  },
  {
    id: 'nec-cca',
    name: 'NEC CCA',
    fullName: 'National Executive Committee - Christian Community Action',
    description: 'Community outreach and social action programs.',
    members: 41,
    recentEvents: 7,
    provinces: ['NC', 'FS', 'NW', 'GP']
  },
  {
    id: 'nec-yca-ymwca',
    name: 'NEC YCA/YMWCA',
    fullName: 'National Executive Committee - Youth & Young Men\'s/Women\'s Christian Association',
    description: 'Youth ministry and young adults\' programs.',
    members: 73,
    recentEvents: 8,
    provinces: ['NC', 'FS', 'NW', 'GP']
  }
];

const Groups = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userEmail = localStorage.getItem('userEmail') || '';
    
    if (authStatus !== 'true') {
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);
    setIsAdmin(userEmail.toLowerCase().includes('admin'));
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Church <span className="text-primary">Groups</span>
              </h1>
              <p className="text-xl max-w-3xl text-secondary-foreground/80">
                Connect with your church community through our various groups and committees serving NC, FS, NW and GP provinces.
              </p>
            </div>
            {isAdmin && (
              <Link to="/admin">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                  <Shield className="h-5 w-5 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Groups Grid */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {churchGroups.map((group) => (
              <Card 
                key={group.id} 
                className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary hover:scale-105 bg-card"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-foreground">{group.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1 text-primary" />
                      <span>{group.members} members</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1 text-primary" />
                      <span>{group.recentEvents} events</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {group.provinces.map((province) => (
                      <span 
                        key={province} 
                        className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"
                      >
                        {province}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link to={`/groups/${group.id}`}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Group
                      </Button>
                    </Link>
                    <Link to={`/groups/${group.id}/post`}>
                      <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground text-sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Post Event
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
              <div className="text-3xl font-bold text-primary">{churchGroups.length}</div>
              <div className="text-muted-foreground">Active Groups</div>
            </div>
            <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
              <div className="text-3xl font-bold text-primary">
                {churchGroups.reduce((sum, group) => sum + group.members, 0)}
              </div>
              <div className="text-muted-foreground">Total Members</div>
            </div>
            <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
              <div className="text-3xl font-bold text-primary">
                {churchGroups.reduce((sum, group) => sum + group.recentEvents, 0)}
              </div>
              <div className="text-muted-foreground">Recent Events</div>
            </div>
            <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="text-muted-foreground">Provinces Served</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Groups;
