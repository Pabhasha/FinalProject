
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Search, AlertCircle, Flag, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { teams } from '@/utils/teamData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters'),
  email: z.string()
    .email('Invalid email address format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine(password => /[A-Z]/.test(password), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine(password => /[0-9]/.test(password), {
      message: 'Password must contain at least one number',
    }),
  confirmPassword: z.string(),
  favoriteTeamId: z.string().min(1, 'Please select your favorite team'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      favoriteTeamId: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setFormError(null);
      
      await register(
        values.username,
        values.email,
        values.password,
        values.favoriteTeamId
      );
      
      const response = await fetch("http:// 127.0.0.1/api/admin", {  
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(values)
      }); 
      
      const data = await response.json();  
      if (!response.ok) throw new Error(data.error || "Failed to create account");
      
      toast.success("Account created successfully");
      navigate('/profile');
    } catch (error) { 
      setFormError(error instanceof Error ? error.message : 'Error creating account');
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  }
  // Filter teams based on search query
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) || 
    team.country.toLowerCase().includes(teamSearchQuery.toLowerCase())
  );

  // Group teams by type
  const clubTeams = filteredTeams.filter(team => team.type === 'club');
  const nationalTeams = filteredTeams.filter(team => team.type === 'national');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
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
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirm password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="favoriteTeamId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Team</FormLabel>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for a team..."
                  value={teamSearchQuery}
                  onChange={(e) => setTeamSearchQuery(e.target.value)}
                  className="pl-10 mb-2"
                />
              </div>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your favorite team" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {clubTeams.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-sm font-semibold flex items-center gap-2 border-b">
                          <Trophy className="h-4 w-4" />
                          <span>Club Teams</span>
                        </div>
                        {clubTeams.map(team => (
                          <SelectItem key={team.id} value={team.id} className="py-2">
                            <div className="flex items-center gap-2">
                              {team.logo && (
                                <img 
                                  src={team.logo} 
                                  alt={team.name} 
                                  className="w-5 h-5 object-contain"
                                />
                              )}
                              <span>{team.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                    
                    {nationalTeams.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-sm font-semibold mt-1 flex items-center gap-2 border-b">
                          <Flag className="h-4 w-4" />
                          <span>National Teams</span>
                        </div>
                        {nationalTeams.map(team => (
                          <SelectItem key={team.id} value={team.id} className="py-2">
                            <div className="flex items-center gap-2">
                              {team.logo && (
                                <img 
                                  src={team.logo} 
                                  alt={team.name} 
                                  className="w-5 h-5 object-contain"
                                />
                              )}
                              <span>{team.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                    
                    {filteredTeams.length === 0 && (
                      <div className="px-2 py-4 text-center text-muted-foreground">
                        No teams found
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
