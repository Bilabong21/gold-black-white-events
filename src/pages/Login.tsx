
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    
    // Simple authentication simulation
    if (formData.email && formData.password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      navigate('/groups');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-black">BRCSA</span>
          </div>
          <CardTitle className="text-2xl font-bold text-black">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to access church groups and post events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="password" className="text-black font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                placeholder="Enter your password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold py-3"
            >
              Sign In
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-yellow-600 hover:text-yellow-500 font-medium">
                  Register here
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

export default Login;
