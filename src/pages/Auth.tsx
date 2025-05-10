
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type LocationState = {
  activeTab?: "login" | "register";
};

const Auth = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [activeTab, setActiveTab] = useState<"login" | "register">(state?.activeTab || "login");

  useEffect(() => {
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
  }, [state]);

  return (
    <MainLayout>
      <div className="page-transition max-w-md mx-auto mt-8 px-4">
        <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-xl">
          <CardHeader className="pb-2">
            <h1 className="text-2xl font-bold text-center">
              {activeTab === "login" ? "Sign In" : "Create Account"}
            </h1>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="register" className="mt-0">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Auth;
