import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="text-2xl font-bold">BRCSA</span>
            </div>
            <p className="text-secondary-foreground/70 mb-4 max-w-md">
              Building communities of faith, hope, and love. Join us in worship, fellowship, and service.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-secondary-foreground/70">
                <MapPin className="h-4 w-4 mr-2 text-primary" /><span>123 Church Street, Community City</span>
              </div>
              <div className="flex items-center text-secondary-foreground/70">
                <Phone className="h-4 w-4 mr-2 text-primary" /><span>(555) 123-4567</span>
              </div>
              <div className="flex items-center text-secondary-foreground/70">
                <Mail className="h-4 w-4 mr-2 text-primary" /><span>info@brcsa.org</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-secondary-foreground/70 hover:text-primary transition-colors">Home</a></li>
              <li><a href="/about" className="text-secondary-foreground/70 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-secondary-foreground/70 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="/groups" className="text-secondary-foreground/70 hover:text-primary transition-colors">Groups</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Service Times</h3>
            <ul className="space-y-2 text-secondary-foreground/70">
              <li>Sunday Morning: 9:00 AM</li>
              <li>Sunday Evening: 6:00 PM</li>
              <li>Wednesday: 7:00 PM</li>
              <li>Prayer Meeting: Fridays 6:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 text-center">
          <p className="text-secondary-foreground/50">© {new Date().getFullYear()} BRCSA. All rights reserved. Built with faith and love.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
