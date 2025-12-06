
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
    
    toast({
      title: "Registration Successful!",
      description: "Welcome to BRCSA community. You can now access church groups.",
    });
    
    navigate('/groups');
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
      
      <Card className="relative w-full max-w-lg shadow-2xl border-t-4 border-t-primary bg-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center border-2 border-primary">
              <span className="text-primary font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-card-foreground">BRCSA</span>
          </div>
          <CardTitle className="text-2xl font-bold text-card-foreground">Join Our Community</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create an account to access church groups and participate in our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-foreground font-medium">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="mt-2 border-border focus:border-primary focus:ring-primary bg-background"
                  placeholder="First name"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-foreground font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="mt-2 border-border focus:border-primary focus:ring-primary bg-background"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-2 border-border focus:border-primary focus:ring-primary bg-background"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-2 border-border focus:border-primary focus:ring-primary bg-background"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-2 border-border focus:border-primary focus:ring-primary bg-background"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="mt-2 border-border focus:border-primary focus:ring-primary bg-background"
                placeholder="Confirm your password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3"
            >
              Create Account
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                  Sign in here
                </Link>
              </p>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground block">
                Back to Home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
