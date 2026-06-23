import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-secondary shadow-lg border-b border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-secondary-foreground">BRCSA</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-secondary-foreground/70 hover:text-primary font-medium transition-colors">Home</Link>
            <Link to="/about" className="text-secondary-foreground/70 hover:text-primary font-medium transition-colors">About Us</Link>
            <Link to="/branches" className="text-secondary-foreground/70 hover:text-primary font-medium transition-colors">Branches</Link>
            <Link to="/contact" className="text-secondary-foreground/70 hover:text-primary font-medium transition-colors">Contact</Link>
            {user && (
              <Link to="/groups" className="text-secondary-foreground/70 hover:text-primary font-medium transition-colors">Church Groups</Link>
            )}
            {user && isAdmin && (
              <Link to="/admin" className="text-secondary-foreground/70 hover:text-primary font-medium transition-colors flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Button onClick={handleLogout} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-secondary-foreground hover:text-primary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">Register</Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-secondary-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-primary/20 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-secondary-foreground/70 hover:text-primary font-medium">Home</Link>
              <Link to="/about" className="text-secondary-foreground/70 hover:text-primary font-medium">About Us</Link>
              <Link to="/contact" className="text-secondary-foreground/70 hover:text-primary font-medium">Contact</Link>
              {user && <Link to="/groups" className="text-secondary-foreground/70 hover:text-primary font-medium">Church Groups</Link>}
              {user && isAdmin && (
                <Link to="/admin" className="text-secondary-foreground/70 hover:text-primary font-medium flex items-center gap-1">
                  <Shield className="h-4 w-4" />Admin
                </Link>
              )}
              <div className="pt-4 border-t border-primary/20">
                {user ? (
                  <Button onClick={handleLogout} variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">Logout</Button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="block">
                      <Button variant="ghost" className="w-full text-secondary-foreground hover:text-primary">Login</Button>
                    </Link>
                    <Link to="/register" className="block">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Register</Button>
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
