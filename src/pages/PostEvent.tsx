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
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PostEvent = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user, isSecretary, isAdmin, loading } = useAuth();
  const [selectedFlyer, setSelectedFlyer] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', date: '', time: '', location: '', description: '', contactPerson: '', contactEmail: '', contactPhone: ''
  });

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (!loading && user && !isSecretary && !isAdmin) {
      toast({ title: "Access Denied", description: "Only secretaries can post events.", variant: "destructive" });
      navigate('/groups');
    }
  }, [user, loading, isSecretary, isAdmin, navigate]);

  const { data: group } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data, error } = await supabase.from('church_groups').select('*').eq('slug', groupId!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!groupId,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFlyerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFlyer(file);
      const reader = new FileReader();
      reader.onload = (e) => setFlyerPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group || !user) return;
    setSubmitting(true);

    let flyerUrl = '';
    if (selectedFlyer) {
      const fileExt = selectedFlyer.name.split('.').pop();
      const filePath = `${group.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('event-flyers').upload(filePath, selectedFlyer);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('event-flyers').getPublicUrl(filePath);
        flyerUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from('events').insert({
      group_id: group.id,
      title: formData.title,
      event_date: formData.date,
      event_time: formData.time,
      location: formData.location,
      description: formData.description,
      contact_person: formData.contactPerson,
      contact_email: formData.contactEmail,
      contact_phone: formData.contactPhone,
      flyer_url: flyerUrl,
      created_by: user.id,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event Posted!", description: "Your event is now visible to all group members." });
      navigate(`/groups/${groupId}`);
    }
    setSubmitting(false);
  };

  if (loading || !user || !group) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-secondary text-secondary-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={`/groups/${groupId}`} className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to {group.name}
          </Link>
          <h1 className="text-4xl font-bold mb-2">Post New Event</h1>
          <p className="text-xl text-secondary-foreground/70">Share your event with the {group.name} community</p>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-t-4 border-t-primary bg-card">
            <CardHeader><CardTitle className="text-2xl font-bold">Event Details</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required className="mt-2" placeholder="Enter event title" />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required className="mt-2" placeholder="Event venue" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date">Event Date *</Label>
                    <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="time">Event Time *</Label>
                    <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} required className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={5} className="mt-2" placeholder="Event details..." />
                </div>

                {/* Flyer upload */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Event Flyer (Optional)</h3>
                  {!flyerPreview ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/30 text-center">
                      <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                      <Label htmlFor="flyer" className="cursor-pointer text-sm font-medium">Upload event flyer</Label>
                      <Input id="flyer" type="file" accept="image/*" onChange={handleFlyerUpload} className="sr-only" />
                      <Button type="button" variant="outline" className="mt-4 border-primary text-primary" onClick={() => document.getElementById('flyer')?.click()}>Choose File</Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <img src={flyerPreview} alt="Flyer preview" className="w-full max-w-md mx-auto rounded-lg shadow-md" />
                      <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => { setSelectedFlyer(null); setFlyerPreview(null); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Contact */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required className="mt-2" placeholder="Full name" />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleInputChange} required className="mt-2" placeholder="Email" />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input id="contactPhone" name="contactPhone" type="tel" value={formData.contactPhone} onChange={handleInputChange} className="mt-2" placeholder="Phone" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={submitting} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3">
                    {submitting ? 'Posting...' : 'Post Event'}
                  </Button>
                  <Link to={`/groups/${groupId}`} className="flex-1">
                    <Button type="button" variant="outline" className="w-full py-3">Cancel</Button>
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
