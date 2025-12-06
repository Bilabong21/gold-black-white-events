import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock, Users, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data for events
const upcomingEvents = [
  {
    id: 1,
    title: "Sunday Morning Service",
    date: "2025-07-06",
    time: "09:00 AM",
    location: "Main Sanctuary",
    description: "Join us for our weekly worship service with inspiring messages and community fellowship.",
    group: "General"
  },
  {
    id: 2,
    title: "PEC FS/NC Youth Meeting",
    date: "2025-07-08",
    time: "06:00 PM",
    location: "Youth Hall",
    description: "Monthly gathering for youth ministry planning and fellowship activities.",
    group: "PEC FS/NC"
  },
  {
    id: 3,
    title: "NEC SYNOD Conference",
    date: "2025-07-12",
    time: "10:00 AM",
    location: "Conference Center",
    description: "Annual synod meeting to discuss church matters and future initiatives.",
    group: "NEC SYNOD"
  },
  {
    id: 4,
    title: "Community Outreach Program",
    date: "2025-07-15",
    time: "02:00 PM",
    location: "Community Center",
    description: "Join us in serving our local community through various outreach activities.",
    group: "CEC"
  }
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Hero Section */}
      <section className="relative bg-secondary text-secondary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-secondary/90"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-2xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to <span className="text-primary">BRCSA</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-secondary-foreground/80">
            Building communities of faith, hope, and love across NC, FS, NW, and GP provinces. Join us in worship, fellowship, and service to our Lord and community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25">
                Join Our Community
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Upcoming Events</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay connected with our community through worship services, fellowship meetings, and special events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary bg-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-card-foreground">{event.title}</CardTitle>
                    <span className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium">
                      {event.group}
                    </span>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-card-foreground/80">
                      <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center text-card-foreground/80">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-card-foreground/80">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/groups">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Join Our Fellowship</h3>
              <p className="text-muted-foreground">
                Connect with our diverse church groups across NC, FS, NW, and GP provinces.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                <Phone className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Get In Touch</h3>
              <p className="text-muted-foreground">
                Have questions or need prayer? Our pastoral team is here to support and guide you.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                <Mail className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Stay Connected</h3>
              <p className="text-muted-foreground">
                Subscribe to our newsletter for updates on events, sermons, and community news.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
