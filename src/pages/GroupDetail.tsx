import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Clock, Users, ArrowLeft, Plus, Crown, User, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user, isSecretary, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  const { data: group } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data, error } = await supabase.from('church_groups').select('*').eq('slug', groupId!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!groupId,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['group-events', group?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*').eq('group_id', group!.id).order('event_date', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!group?.id,
  });

  const { data: members = [] } = useQuery({
    queryKey: ['group-members', group?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('committee_members').select('*').eq('group_id', group!.id).order('position');
      if (error) throw error;
      return data;
    },
    enabled: !!group?.id,
  });

  if (loading || !user) return null;

  if (!group) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Group Not Found</h1>
          <Link to="/groups"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Back to Groups</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-secondary text-secondary-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/groups" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Groups
          </Link>
          <h1 className="text-4xl font-bold mb-2">{group.name}</h1>
          <p className="text-xl text-secondary-foreground/70 mb-4">{group.full_name}</p>
          <div className="flex flex-wrap gap-4">
            <Badge className="bg-primary text-primary-foreground">
              <Users className="h-4 w-4 mr-1" />{members.length} Members
            </Badge>
            {group.established && <Badge variant="secondary">Est. {group.established}</Badge>}
          </div>
        </div>
      </section>

      {/* Actions */}
      {isSecretary && (
        <section className="py-8 bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Got an upcoming event?</h2>
            <p className="text-muted-foreground mb-4">Share it with the {group.name} community!</p>
            <Link to={`/groups/${groupId}/post`}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-3">
                <Plus className="h-5 w-5 mr-2" />Post Your Event Now
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Events */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader><CardTitle className="text-xl font-bold">About This Group</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{group.description}</p>
                  {group.contact_email && (
                    <div><h4 className="font-semibold text-foreground">Contact</h4><p className="text-muted-foreground">{group.contact_email}</p></div>
                  )}
                  <div>
                    <h4 className="font-semibold text-foreground">Regions Served</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(group.provinces as string[] || []).map((r: string) => (
                        <Badge key={r} variant="outline">{r}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
                <Badge variant="secondary">{events.length} Events</Badge>
              </div>
              {events.length > 0 ? (
                <div className="space-y-6">
                  {events.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-semibold">{event.title}</CardTitle>
                          <Badge className="bg-accent text-accent-foreground">{event.status}</Badge>
                        </div>
                        <CardDescription>{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                          <div className="flex items-center text-muted-foreground"><Clock className="h-4 w-4 mr-2 text-primary" />{event.event_time}</div>
                          <div className="flex items-center text-muted-foreground"><MapPin className="h-4 w-4 mr-2 text-primary" />{event.location}</div>
                        </div>
                        {event.flyer_url && (
                          <img src={event.flyer_url} alt={`${event.title} flyer`} className="w-full max-w-sm mt-4 rounded-lg shadow-sm" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Events Yet</h3>
                    <p className="text-muted-foreground">This group hasn't posted any events yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      {members.length > 0 && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Leadership Cabinet</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary">
                    <TableHead className="text-secondary-foreground">Member</TableHead>
                    <TableHead className="text-secondary-foreground">Position</TableHead>
                    <TableHead className="text-secondary-foreground">Branch</TableHead>
                    <TableHead className="text-secondary-foreground">Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary">
                            <AvatarImage src={member.picture_url || ''} />
                            <AvatarFallback className="bg-primary/10 text-primary">{member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="border-primary text-primary">{member.position}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{member.branch}</TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{member.email}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default GroupDetail;
