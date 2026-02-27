import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Plus, Eye, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Groups = () => {
  const { user, isAdmin, isSecretary, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const { data: groups = [] } = useQuery({
    queryKey: ['church-groups'],
    queryFn: async () => {
      const { data, error } = await supabase.from('church_groups').select('*').order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: eventCounts = {} } = useQuery({
    queryKey: ['event-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('group_id');
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach(e => { counts[e.group_id] = (counts[e.group_id] || 0) + 1; });
      return counts;
    },
    enabled: !!user,
  });

  const { data: memberCounts = {} } = useQuery({
    queryKey: ['member-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('committee_members').select('group_id');
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach(m => { counts[m.group_id!] = (counts[m.group_id!] || 0) + 1; });
      return counts;
    },
    enabled: !!user,
  });

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-secondary text-secondary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4">Church <span className="text-primary">Groups</span></h1>
              <p className="text-xl max-w-3xl text-secondary-foreground/80">
                Connect with your church community through our various groups and committees serving NC, FS, NW and GP provinces.
              </p>
            </div>
            {isAdmin && (
              <Link to="/admin">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                  <Shield className="h-5 w-5 mr-2" />Admin Panel
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary hover:scale-105 bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-foreground">{group.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-2">{group.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1 text-primary" />
                      <span>{memberCounts[group.id] || 0} members</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1 text-primary" />
                      <span>{eventCounts[group.id] || 0} events</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(group.provinces as string[] || []).map((province: string) => (
                      <span key={province} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{province}</span>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link to={`/groups/${group.slug}`}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
                        <Eye className="h-4 w-4 mr-2" />View Group
                      </Button>
                    </Link>
                    {isSecretary && (
                      <Link to={`/groups/${group.slug}/post`}>
                        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm">
                          <Plus className="h-4 w-4 mr-2" />Post Event
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
              <div className="text-3xl font-bold text-primary">{groups.length}</div>
              <div className="text-muted-foreground">Active Groups</div>
            </div>
            <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
              <div className="text-3xl font-bold text-primary">
                {Object.values(memberCounts).reduce((a: number, b: number) => a + b, 0)}
              </div>
              <div className="text-muted-foreground">Total Members</div>
            </div>
            <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
              <div className="text-3xl font-bold text-primary">
                {Object.values(eventCounts).reduce((a: number, b: number) => a + b, 0)}
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
