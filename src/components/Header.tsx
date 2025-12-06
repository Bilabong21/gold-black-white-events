import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header = ({ isAuthenticated }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || '';
  const isAdmin = userEmail.toLowerCase().includes('admin');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="bg-card shadow-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-primary font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-foreground">BRCSA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Contact
            </Link>
            {isAuthenticated && (
              <Link to="/groups" className="text-muted-foreground hover:text-primary font-medium transition-colors">
                Church Groups
              </Link>
            )}
            {isAuthenticated && isAdmin && (
              <Link to="/admin" className="text-muted-foreground hover:text-primary font-medium transition-colors flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-secondary text-foreground hover:bg-secondary hover:text-secondary-foreground"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-muted-foreground hover:text-primary font-medium">
                Home
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary font-medium">
                About Us
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary font-medium">
                Contact
              </Link>
              {isAuthenticated && (
                <Link to="/groups" className="text-muted-foreground hover:text-primary font-medium">
                  Church Groups
                </Link>
              )}
              {isAuthenticated && isAdmin && (
                <Link to="/admin" className="text-muted-foreground hover:text-primary font-medium flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <div className="pt-4 border-t border-border">
                {isAuthenticated ? (
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full border-secondary text-foreground hover:bg-secondary hover:text-secondary-foreground"
                  >
                    Logout
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="block">
                      <Button variant="ghost" className="w-full text-foreground hover:text-primary">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" className="block">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
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
