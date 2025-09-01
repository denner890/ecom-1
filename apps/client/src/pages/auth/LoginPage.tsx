import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Sign in to your account</h2>
          <p className="mt-2 text-muted-foreground">
            Or{' '}
            <Link to="/auth/register" className="text-primary hover:text-primary/80 transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        
        <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
          <h3 className="font-semibold mb-4 text-card-foreground">Login Form</h3>
          <p className="text-muted-foreground">
            Login form with React Hook Form + Zod validation will go here.
            Firebase Email/Password and Google auth integration ready.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;