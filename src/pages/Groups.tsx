
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MapPin, Plus, Eye } from "lucide-react";
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
    color: 'bg-blue-100 border-blue-500'
  },
  {
    id: 'pec-gp-nw',
    name: 'PEC for GP/NW',
    fullName: 'Provincial Executive Committee for Gauteng/North West',
    description: 'Managing church activities in Gauteng and North West provinces.',
    members: 62,
    recentEvents: 5,
    color: 'bg-green-100 border-green-500'
  },
  {
    id: 'cec',
    name: 'CEC',
    fullName: 'Central Executive Committee',
    description: 'Central coordination and administrative oversight.',
    members: 28,
    recentEvents: 2,
    color: 'bg-purple-100 border-purple-500'
  },
  {
    id: 'nec-synod',
    name: 'NEC SYNOD',
    fullName: 'Northern Executive Committee Synod',
    description: 'Synod meetings and theological discussions for northern regions.',
    members: 38,
    recentEvents: 4,
    color: 'bg-orange-100 border-orange-500'
  },
  {
    id: 'nec-mca',
    name: 'NEC MCA',
    fullName: 'Northern Executive Committee - Men\'s Christian Association',
    description: 'Men\'s ministry and fellowship activities in northern regions.',
    members: 52,
    recentEvents: 6,
    color: 'bg-indigo-100 border-indigo-500'
  },
  {
    id: 'nec-cm',
    name: 'NEC CM',
    fullName: 'Northern Executive Committee - Christian Ministry',
    description: 'General Christian ministry coordination for northern areas.',
    members: 34,
    recentEvents: 3,
    color: 'bg-red-100 border-red-500'
  },
  {
    id: 'nec-cca',
    name: 'NEC CCA',
    fullName: 'Northern Executive Committee - Christian Community Action',
    description: 'Community outreach and social action programs.',
    members: 41,
    recentEvents: 7,
    color: 'bg-teal-100 border-teal-500'
  },
  {
    id: 'nec-yca-ymwca',
    name: 'NEC YCA/YMWCA',
    fullName: 'Northern Executive Committee - Youth & Young Men\'s/Women\'s Christian Association',
    description: 'Youth ministry and young adults\' programs.',
    members: 73,
    recentEvents: 8,
    color: 'bg-pink-100 border-pink-500'
  }
];

const Groups = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            Church <span className="text-yellow-400">Groups</span>
          </h1>
          <p className="text-xl max-w-3xl">
            Connect with your church community through our various groups and committees. Each group serves a unique purpose in our mission.
          </p>
        </div>
      </section>

      {/* Groups Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {churchGroups.map((group) => (
              <Card 
                key={group.id} 
                className={`hover:shadow-lg transition-all duration-300 border-l-4 ${group.color} hover:scale-105`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-black">{group.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 line-clamp-2">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1 text-yellow-400" />
                      <span>{group.members} members</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1 text-yellow-400" />
                      <span>{group.recentEvents} events</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link to={`/groups/${group.id}`}>
                      <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 text-sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Group
                      </Button>
                    </Link>
                    <Link to={`/groups/${group.id}/post`}>
                      <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white text-sm">
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-black">{churchGroups.length}</div>
              <div className="text-gray-600">Active Groups</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black">
                {churchGroups.reduce((sum, group) => sum + group.members, 0)}
              </div>
              <div className="text-gray-600">Total Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black">
                {churchGroups.reduce((sum, group) => sum + group.recentEvents, 0)}
              </div>
              <div className="text-gray-600">Recent Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black">12</div>
              <div className="text-gray-600">Provinces Served</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Groups;
