import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      navigate('/groups');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>

      <Card className="relative w-full max-w-md shadow-2xl border-t-4 border-t-primary bg-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-card-foreground">BRCSA</span>
          </div>
          <CardTitle className="text-2xl font-bold text-card-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access church groups and post events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2" placeholder="Enter your email" />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2" placeholder="Enter your password" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:text-primary/80 font-medium">Register here</Link>
              </p>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground block">Back to Home</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
