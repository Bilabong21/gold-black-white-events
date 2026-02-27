
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "Thank you for contacting us. We'll get back to you soon." });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-secondary text-secondary-foreground py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-secondary-foreground/80">
            We'd love to hear from you. Reach out to us for prayer requests, questions, or to learn more about joining our community.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-foreground mb-6">Get In Touch</h2>
              <div className="w-16 h-1 bg-primary mb-8"></div>
              
              <div className="space-y-6">
                <Card className="border-l-4 border-l-primary bg-card hover:shadow-lg transition-shadow group">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">Our Location</h3>
                        <p className="text-muted-foreground">
                          123 Church Street<br />
                          Community City, CC 12345<br />
                          South Africa
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary bg-card hover:shadow-lg transition-shadow group">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">Phone</h3>
                        <p className="text-muted-foreground">
                          Main Office: (555) 123-4567<br />
                          Pastor's Line: (555) 123-4568
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary bg-card hover:shadow-lg transition-shadow group">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">Email</h3>
                        <p className="text-muted-foreground">
                          General: info@brcsa.org<br />
                          Pastor: pastor@brcsa.org
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary bg-card hover:shadow-lg transition-shadow group">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">Office Hours</h3>
                        <p className="text-muted-foreground">
                          Monday - Friday: 9:00 AM - 5:00 PM<br />
                          Saturday: 10:00 AM - 2:00 PM<br />
                          Sunday: After service
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-t-4 border-t-primary bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-card-foreground">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-foreground font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-2 border-border focus:border-primary focus:ring-primary"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-foreground font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-2 border-border focus:border-primary focus:ring-primary"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-2 border-border focus:border-primary focus:ring-primary"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-foreground font-medium">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="mt-2 border-border focus:border-primary focus:ring-primary"
                          placeholder="What is this regarding?"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-foreground font-medium">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="mt-2 border-border focus:border-primary focus:ring-primary"
                        placeholder="Please share your message, prayer request, or question..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
