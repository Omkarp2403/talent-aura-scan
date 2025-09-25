import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Zap, Shield, Users, FileText, Target, TrendingUp, Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze resumes with precision and speed",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process hundreds of resumes in seconds, not hours",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with complete data privacy protection",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "Precise candidate-job matching based on skills, experience, and requirements",
      color: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "10M+", label: "Resumes Processed", icon: FileText },
    { number: "95%", label: "Accuracy Rate", icon: Target },
    { number: "500+", label: "Happy Clients", icon: Users },
    { number: "4.9", label: "User Rating", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background particles */}
      <div className="ai-particles fixed inset-0 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-50 border-b border-border/20 glass">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-poppins">ResumeAI</h1>
                <p className="text-xs text-muted-foreground">Intelligent Screening</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="hover:bg-primary/10"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg hover:shadow-primary/25"
                onClick={() => navigate('/register')}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-5xl mx-auto">
            <Badge 
              variant="secondary" 
              className={`mb-6 px-4 py-2 text-sm font-medium animate-bounce-in ${isVisible ? 'animate-bounce-in' : 'opacity-0'}`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Powered by Advanced AI Technology
            </Badge>
            
            <h1 className={`text-5xl md:text-7xl font-bold font-poppins mb-8 leading-tight ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Transform Your{' '}
              <span className="gradient-text">
                Hiring Process
              </span>{' '}
              with AI
            </h1>
            
            <p className={`text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed ${isVisible ? 'animate-fade-in-up fade-in-delay' : 'opacity-0'}`}>
              Revolutionize recruitment with intelligent resume screening. 
              Our AI-powered platform analyzes, scores, and ranks candidates 
              with unprecedented accuracy and speed.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 ${isVisible ? 'animate-fade-in-up fade-in-delay-2' : 'opacity-0'}`}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-xl hover:shadow-primary/25 text-lg px-8 py-6 h-auto pulse-glow"
                onClick={() => navigate('/register')}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-lg px-8 py-6 h-auto"
                onClick={() => navigate('/demo')}
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${isVisible ? 'animate-fade-in-up fade-in-delay-3' : 'opacity-0'}`}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center group hover-scale">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold font-poppins text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
              Why Choose <span className="gradient-text">ResumeAI</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of recruitment with cutting-edge AI technology
              that delivers exceptional results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`glass-card hover-glow hover-scale group float ${index % 2 === 0 ? '' : 'float-delay'}`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold font-poppins mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
              Simple <span className="gradient-text">3-Step Process</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our intuitive platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Resumes",
                description: "Bulk upload resumes or connect to your ATS system for seamless integration"
              },
              {
                step: "02", 
                title: "AI Analysis",
                description: "Our AI engine analyzes and scores each resume based on your job requirements"
              },
              {
                step: "03",
                title: "Get Results",
                description: "Receive ranked candidates with detailed insights and recommendations"
              }
            ].map((item, index) => (
              <div key={index} className="text-center group hover-scale">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white shadow-xl group-hover:shadow-primary/25 transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold font-poppins mb-4 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 text-center">
          <Card className="glass-card max-w-4xl mx-auto p-12 hover-glow">
            <CardContent className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold font-poppins">
                Ready to <span className="gradient-text">Transform</span> Your Hiring?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of companies that have revolutionized their recruitment process with ResumeAI.
                Start your free trial today and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-xl hover:shadow-primary/25 text-lg px-8 py-6 h-auto pulse-glow"
                  onClick={() => navigate('/register')}
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-lg px-8 py-6 h-auto"
                >
                  Schedule Demo
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Cancel anytime
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 bg-muted/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold font-poppins">ResumeAI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 ResumeAI. Revolutionizing recruitment with artificial intelligence.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;