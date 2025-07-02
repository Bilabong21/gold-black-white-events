
import { useState, useEffect } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

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
    console.log('Form submitted:', formData);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isAuthenticated={isAuthenticated} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Contact <span className="text-yellow-400">Us</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            We'd love to hear from you. Reach out to us for prayer requests, questions, or to learn more about joining our community.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-black mb-6">Get In Touch</h2>
              <div className="w-16 h-1 bg-yellow-400 mb-8"></div>
              
              <div className="space-y-6">
                <Card className="border-l-4 border-l-yellow-400">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-yellow-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-black">Our Location</h3>
                        <p className="text-gray-600">
                          123 Church Street<br />
                          Community City, CC 12345<br />
                          South Africa
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-400">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-yellow-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-black">Phone</h3>
                        <p className="text-gray-600">
                          Main Office: (555) 123-4567<br />
                          Pastor's Line: (555) 123-4568
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-400">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-yellow-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-black">Email</h3>
                        <p className="text-gray-600">
                          General: info@brcsa.org<br />
                          Pastor: pastor@brcsa.org
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-400">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-yellow-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-black">Office Hours</h3>
                        <p className="text-gray-600">
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
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-black">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-black font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-black font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="text-black font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-black font-medium">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                          placeholder="What is this regarding?"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-black font-medium">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                        placeholder="Please share your message, prayer request, or question..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold py-3"
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
