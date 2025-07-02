
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header = ({ isAuthenticated }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-black">BRCSA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-yellow-400 font-medium transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-yellow-400 font-medium transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-yellow-400 font-medium transition-colors">
              Contact
            </Link>
            {isAuthenticated && (
              <Link to="/groups" className="text-gray-700 hover:text-yellow-400 font-medium transition-colors">
                Church Groups
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-black text-black hover:bg-black hover:text-white"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-black hover:text-yellow-400">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-yellow-400 font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-yellow-400 font-medium">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-yellow-400 font-medium">
                Contact
              </Link>
              {isAuthenticated && (
                <Link to="/groups" className="text-gray-700 hover:text-yellow-400 font-medium">
                  Church Groups
                </Link>
              )}
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full border-black text-black hover:bg-black hover:text-white"
                  >
                    Logout
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="block">
                      <Button variant="ghost" className="w-full text-black hover:text-yellow-400">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" className="block">
                      <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
