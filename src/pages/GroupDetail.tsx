import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, ArrowLeft, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data for group events with flyers
const groupEvents = {
  'pec-fs-nc': [
    {
      id: 1,
      title: "Provincial Planning Meeting",
      date: "2025-07-10",
      time: "10:00 AM",
      location: "Bloemfontein Conference Hall",
      description: "Quarterly planning session for Free State and Northern Cape activities.",
      status: "upcoming",
      flyer: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&h=600&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Youth Ministry Workshop",
      date: "2025-07-15",
      time: "2:00 PM",
      location: "Kimberley Youth Center",
      description: "Training workshop for youth leaders in the region.",
      status: "upcoming"
    }
  ],
  'nec-yca-ymwca': [
    {
      id: 3,
      title: "Youth Leadership Summit",
      date: "2025-07-12",
      time: "9:00 AM",
      location: "Pretoria Convention Center",
      description: "Annual summit for young leaders to discuss ministry initiatives.",
      status: "upcoming",
      flyer: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=600&fit=crop&crop=center"
    },
    {
      id: 4,
      title: "Community Service Day",
      date: "2025-07-20",
      time: "8:00 AM",
      location: "Various Locations",
      description: "Community outreach and service activities across the region.",
      status: "upcoming"
    }
  ]
  // Add more groups as needed
};

const groupDetails = {
  'pec-fs-nc': {
    name: 'PEC for FS/NC',
    fullName: 'Provincial Executive Committee for Free State/Northern Cape',
    description: 'The Provincial Executive Committee for Free State and Northern Cape serves as the regional governance body overseeing churches and ministries in these provinces. We coordinate activities, provide pastoral support, and ensure alignment with BRCSA values and mission.',
    members: 45,
    established: '1995',
    contact: 'pec.fsnc@brcsa.org',
    regions: ['Free State', 'Northern Cape']
  },
  'nec-yca-ymwca': {
    name: 'NEC YCA/YMWCA',
    fullName: 'Northern Executive Committee - Youth & Young Men\'s/Women\'s Christian Association',
    description: 'Our youth ministry focuses on developing young leaders, providing mentorship, and creating opportunities for spiritual growth and community service. We serve youth and young adults across northern regions.',
    members: 73,
    established: '1988',
    contact: 'youth@brcsa.org',
    regions: ['Gauteng', 'Limpopo', 'Mpumalanga', 'North West']
  }
  // Add more group details as needed
};

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  if (!isAuthenticated || !groupId) {
    return null;
  }

  const group = groupDetails[groupId as keyof typeof groupDetails];
  const events = groupEvents[groupId as keyof typeof groupEvents] || [];

  if (!group) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Group Not Found</h1>
          <Link to="/groups">
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
              Back to Groups
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/groups" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Link>
          <h1 className="text-4xl font-bold mb-2">{group.name}</h1>
          <p className="text-xl text-gray-300 mb-4">{group.fullName}</p>
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="bg-yellow-400 text-black">
              <Users className="h-4 w-4 mr-1" />
              {group.members} Members
            </Badge>
            <Badge variant="secondary" className="bg-white text-black">
              Est. {group.established}
            </Badge>
          </div>
        </div>
      </section>

      {/* Group Info and Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Group Information */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-black">About This Group</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{group.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-black">Contact</h4>
                    <p className="text-gray-600">{group.contact}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-black">Regions Served</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.regions.map((region) => (
                        <Badge key={region} variant="outline">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link to={`/groups/${groupId}/post`}>
                    <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 mt-6">
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Event
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Events List */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Upcoming Events</h2>
                <Badge variant="secondary" className="bg-black text-white">
                  {events.length} Events
                </Badge>
              </div>

              {events.length > 0 ? (
                <div className="space-y-6">
                  {events.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-yellow-400">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-semibold text-black">{event.title}</CardTitle>
                          <Badge className="bg-green-100 text-green-800">
                            {event.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-600">
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* Event Details */}
                          <div className="lg:col-span-2 space-y-3">
                            <div className="flex items-center text-gray-700">
                              <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                              <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Clock className="h-4 w-4 mr-2 text-yellow-400" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          {/* Event Flyer */}
                          {event.flyer && (
                            <div className="lg:col-span-1">
                              <img
                                src={event.flyer}
                                alt={`${event.title} flyer`}
                                className="w-full h-48 object-cover rounded-lg shadow-sm"
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-black mb-2">No Events Yet</h3>
                    <p className="text-gray-600 mb-4">This group hasn't posted any events yet.</p>
                    <Link to={`/groups/${groupId}/post`}>
                      <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                        <Plus className="h-4 w-4 mr-2" />
                        Be the First to Post
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GroupDetail;
