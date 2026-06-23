import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock, Users, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user } = useAuth();

  const { data: events = [] } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, church_groups(name)')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative bg-secondary text-secondary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-secondary/90"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-2xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to <span className="text-primary">BRCSA</span></h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-secondary-foreground/80">
            Building communities of faith, hope, and love across NC, FS, NW, and GP provinces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg">Join Our Community</Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Events */}
      {events.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">Upcoming Events</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary bg-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-semibold text-card-foreground">{event.title}</CardTitle>
                      <span className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium">
                        {(event as any).church_groups?.name || 'General'}
                      </span>
                    </div>
                    <CardDescription className="text-muted-foreground">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-card-foreground/80">
                        <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                        <span>{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-card-foreground/80">
                        <Clock className="h-4 w-4 mr-2 text-primary" /><span>{event.event_time}</span>
                      </div>
                      <div className="flex items-center text-card-foreground/80">
                        <MapPin className="h-4 w-4 mr-2 text-primary" /><span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Info */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Join Our Fellowship", desc: "Connect with our diverse church groups across NC, FS, NW, and GP provinces." },
              { icon: Phone, title: "Get In Touch", desc: "Have questions or need prayer? Our pastoral team is here to support you." },
              { icon: Mail, title: "Stay Connected", desc: "Subscribe to our newsletter for updates on events, sermons, and community news." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary/25">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
