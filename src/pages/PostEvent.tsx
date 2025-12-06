
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const PostEvent = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFlyer, setSelectedFlyer] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
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

  const handleFlyerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFlyer(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFlyerPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive"
        });
      }
    }
  };

  const removeFlyer = () => {
    setSelectedFlyer(null);
    setFlyerPreview(null);
    const fileInput = document.getElementById('flyer') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Event posted:', { ...formData, groupId, flyer: selectedFlyer?.name });
    
    toast({
      title: "Event Posted Successfully!",
      description: "Your event has been posted and will be visible to all group members.",
    });
    
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
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={`/groups/${groupId}`} className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {groupName}
          </Link>
          <h1 className="text-4xl font-bold mb-2">Post New Event</h1>
          <p className="text-xl text-secondary-foreground/70">
            Share your event with the {groupName} community
          </p>
        </div>
      </section>

      {/* Post Event Form */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-t-4 border-t-primary bg-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-card-foreground">Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-foreground font-medium">Event Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-border focus:border-primary focus:ring-primary"
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-foreground font-medium">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-border focus:border-primary focus:ring-primary"
                      placeholder="Event location/venue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date" className="text-foreground font-medium">Event Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-foreground font-medium">Event Time *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground font-medium">Event Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="mt-2 border-border focus:border-primary focus:ring-primary"
                    placeholder="Provide detailed information about the event, its purpose, agenda, and any special requirements..."
                  />
                </div>

                {/* Event Flyer Upload */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Event Flyer (Optional)</h3>
                  
                  {!flyerPreview ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="flyer" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-foreground">
                              Upload event flyer
                            </span>
                            <span className="mt-1 block text-sm text-muted-foreground">
                              PNG, JPG, GIF up to 10MB
                            </span>
                          </Label>
                          <Input
                            id="flyer"
                            name="flyer"
                            type="file"
                            accept="image/*"
                            onChange={handleFlyerUpload}
                            className="sr-only"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={() => document.getElementById('flyer')?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={flyerPreview}
                        alt="Event flyer preview"
                        className="w-full max-w-md mx-auto rounded-lg shadow-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeFlyer}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        {selectedFlyer?.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="contactPerson" className="text-foreground font-medium">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        type="text"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                        className="mt-2 border-border focus:border-primary focus:ring-primary"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail" className="text-foreground font-medium">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        required
                        className="mt-2 border-border focus:border-primary focus:ring-primary"
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone" className="text-foreground font-medium">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="mt-2 border-border focus:border-primary focus:ring-primary"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3"
                  >
                    Post Event
                  </Button>
                  <Link to={`/groups/${groupId}`} className="flex-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-secondary-foreground text-foreground hover:bg-secondary hover:text-secondary-foreground py-3"
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
