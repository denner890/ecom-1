import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Chrome } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, loginWithGoogle, isLoading } = useAuthStore();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    const result = await registerUser(data.email, data.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const result = await loginWithGoogle();
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Google registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
          <p className="mt-2 text-muted-foreground">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-primary hover:text-primary/80 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
        
        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-card-foreground">Join MerchApp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Full name"
                  {...register('name')}
                  error={errors.name?.message}
                  icon={<User className="w-4 h-4" />}
                />
              </div>
              
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  {...register('email')}
                  error={errors.email?.message}
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                  error={errors.password?.message}
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-2" />
              Sign up with Google
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default RegisterPage;