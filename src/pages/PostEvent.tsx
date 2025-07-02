
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const PostEvent = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    console.log('Event posted:', { ...formData, groupId });
    
    toast({
      title: "Event Posted Successfully!",
      description: "Your event has been posted and will be visible to all group members.",
    });
    
    // Navigate back to the group page
    navigate(`/groups/${groupId}`);
  };

  if (!isAuthenticated || !groupId) {
    return null;
  }

  const groupNames: { [key: string]: string } = {
    'pec-fs-nc': 'PEC for FS/NC',
    'pec-gp-nw': 'PEC for GP/NW',
    'cec': 'CEC',
    'nec-synod': 'NEC SYNOD',
    'nec-mca': 'NEC MCA',
    'nec-cm': 'NEC CM',
    'nec-cca': 'NEC CCA',
    'nec-yca-ymwca': 'NEC YCA/YMWCA'
  };

  const groupName = groupNames[groupId] || 'Unknown Group';

  return (
    <div className="min-h-screen bg-white">
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={`/groups/${groupId}`} className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {groupName}
          </Link>
          <h1 className="text-4xl font-bold mb-2">Post New Event</h1>
          <p className="text-xl text-gray-300">
            Share your event with the {groupName} community
          </p>
        </div>
      </section>

      {/* Post Event Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-black">Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-black font-medium">Event Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-black font-medium">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                      placeholder="Event location/venue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date" className="text-black font-medium">Event Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-black font-medium">Event Time *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-black font-medium">Event Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                    placeholder="Provide detailed information about the event, its purpose, agenda, and any special requirements..."
                  />
                </div>

                {/* Contact Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-black mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="contactPerson" className="text-black font-medium">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        type="text"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                        className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail" className="text-black font-medium">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        required
                        className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone" className="text-black font-medium">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 font-semibold py-3"
                  >
                    Post Event
                  </Button>
                  <Link to={`/groups/${groupId}`} className="flex-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-black text-black hover:bg-black hover:text-white py-3"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PostEvent;
