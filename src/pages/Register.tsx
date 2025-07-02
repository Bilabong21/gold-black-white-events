
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
    
    // Basic validation
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

    // Simple registration simulation
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-black">BRCSA</span>
          </div>
          <CardTitle className="text-2xl font-bold text-black">Join Our Community</CardTitle>
          <CardDescription className="text-gray-600">
            Create an account to access church groups and participate in our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-black font-medium">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                  placeholder="First name"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-black font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-black font-medium">Email Address</Label>
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
              <Label htmlFor="password" className="text-black font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-black font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                placeholder="Confirm your password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold py-3"
            >
              Create Account
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-yellow-600 hover:text-yellow-500 font-medium">
                  Sign in here
                </Link>
              </p>
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
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
