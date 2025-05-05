
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AdminLoginValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // If already authenticated, redirect to admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (values: AdminLoginValues) => {
    setIsLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        toast.success('Login successful');
        navigate('/admin/dashboard');
      } else {
        setLoginAttempts(prev => prev + 1);
        
        // Show different messages based on attempt count
        if (loginAttempts >= 2) {
          toast.error('Multiple failed login attempts. Please check your credentials carefully.');
        } else {
          toast.error('Invalid email or password');
        }
      }
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Default credentials helper
  const setDefaultCredentials = () => {
    form.setValue('email', 'admin@footballtrackr.com');
    form.setValue('password', 'admin123');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the admin panel
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                        <div className="px-3 py-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                        </div>
                        <Input 
                          className="border-0 focus-visible:ring-0 p-0" 
                          placeholder="admin@footballtrackr.com" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                        <div className="px-3 py-2 text-muted-foreground">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input 
                          className="border-0 focus-visible:ring-0 p-0 flex-1" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter password" 
                          {...field} 
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="mr-1"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full">
            <Button 
              variant="link" 
              className="text-xs text-muted-foreground"
              onClick={setDefaultCredentials}
            >
              Use default credentials (for demo only)
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
