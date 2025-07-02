
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <span className="text-2xl font-bold">BRCSA</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Building communities of faith, hope, and love. Join us in worship, fellowship, and service to our Lord and community.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2 text-yellow-400" />
                <span>123 Church Street, Community City, CC 12345</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2 text-yellow-400" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2 text-yellow-400" />
                <span>info@brcsa.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors">Events</a></li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Service Times</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Sunday Morning: 9:00 AM</li>
              <li>Sunday Evening: 6:00 PM</li>
              <li>Wednesday: 7:00 PM</li>
              <li>Prayer Meeting: Fridays 6:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 BRCSA. All rights reserved. Built with faith and love.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
