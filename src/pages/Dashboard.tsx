import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Upload, 
  FileText, 
  Users, 
  TrendingUp, 
  Star, 
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Plus,
  Settings,
  Bell,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [realStats, setRealStats] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check authentication
    if (!api.utils.isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    // Get username
    const storedUsername = api.utils.getUsername();
    setUsername(storedUsername || "User");
    
    // Load dashboard data
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const result = await api.cv.getRequirementSummary();
      if (result.success) {
        setRealStats(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    navigate("/");
  };

  const stats = [
    {
      title: "Total Resumes",
      value: "2,847",
      change: "+12%",
      icon: FileText,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Jobs",
      value: "24",
      change: "+3",
      icon: Users,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Top Matches",
      value: "156",
      change: "+8%",
      icon: Star,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Processing",
      value: "43",
      change: "In Queue",
      icon: Brain,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const recentJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp",
      candidates: 127,
      status: "Active",
      progress: 85,
      topMatch: "John Doe",
      score: 95
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateCo",
      candidates: 89,
      status: "Processing",
      progress: 60,
      topMatch: "Jane Smith",
      score: 92
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "DataLab",
      candidates: 156,
      status: "Complete",
      progress: 100,
      topMatch: "Mike Johnson",
      score: 98
    },
    {
      id: 4,
      title: "UX Designer",
      company: "DesignStudio",
      candidates: 74,
      status: "Active",
      progress: 45,
      topMatch: "Sarah Wilson",
      score: 89
    }
  ];

  const topCandidates = [
    {
      name: "Alex Rodriguez",
      role: "Full Stack Developer",
      score: 98,
      experience: "5 years",
      skills: ["React", "Node.js", "Python"],
      avatar: "AR"
    },
    {
      name: "Emma Chen",
      role: "Machine Learning Engineer",
      score: 97,
      experience: "3 years",
      skills: ["TensorFlow", "Python", "AWS"],
      avatar: "EC"
    },
    {
      name: "David Kumar",
      role: "DevOps Engineer",
      score: 95,
      experience: "7 years",
      skills: ["Docker", "Kubernetes", "AWS"],
      avatar: "DK"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Processing": return "bg-orange-500";
      case "Complete": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 glass sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-poppins">ResumeAI</h1>
                  <p className="text-xs text-muted-foreground">Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Settings className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium text-sm">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold font-poppins mb-2">
            Welcome back, {username}! 👋
          </h2>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your resume screening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`glass-card hover-glow hover-scale animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold font-poppins mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-success">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="glass">
              <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
              <TabsTrigger value="candidates">Top Candidates</TabsTrigger>
              <TabsTrigger value="upload">Upload Resumes</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 glass border-primary/20"
                />
              </div>
              <Button variant="outline" size="icon" className="glass border-primary/20">
                <Filter className="w-4 h-4" />
              </Button>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary text-white"
                onClick={() => navigate("/job-selection")}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Job
              </Button>
            </div>
          </div>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid gap-6">
              {recentJobs.map((job, index) => (
                <Card 
                  key={job.id} 
                  className={`glass-card hover-glow animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold font-poppins">
                            {job.title}
                          </h3>
                          <p className="text-muted-foreground">{job.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(job.status)} text-white`}
                        >
                          {job.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Candidates Processed
                        </p>
                        <div className="flex items-center space-x-3">
                          <Progress value={job.progress} className="flex-1" />
                          <span className="text-sm font-medium">
                            {job.candidates}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Top Match
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-medium">
                            {job.topMatch.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium">{job.topMatch}</span>
                          <Badge variant="secondary" className="bg-success text-white">
                            {job.score}%
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="glass">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="glass">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            <div className="grid gap-4">
              {topCandidates.map((candidate, index) => (
                <Card 
                  key={index} 
                  className={`glass-card hover-glow hover-scale animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                          {candidate.avatar}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold font-poppins">
                            {candidate.name}
                          </h3>
                          <p className="text-muted-foreground">{candidate.role}</p>
                          <p className="text-sm text-muted-foreground">
                            {candidate.experience} experience
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-lg font-bold text-success">
                            {candidate.score}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill, skillIndex) => (
                            <Badge 
                              key={skillIndex} 
                              variant="secondary" 
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Resumes</span>
                </CardTitle>
                <CardDescription>
                  Upload multiple resume files for AI-powered analysis and scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-primary/20 rounded-xl p-12 text-center hover:border-primary/40 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Drop files here or click to upload
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Supports PDF, DOC, DOCX files up to 10MB each
                  </p>
                  <Button className="bg-gradient-to-r from-primary to-secondary text-white">
                    Choose Files
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass border-primary/20">
                    <CardContent className="p-4 text-center">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-1">AI Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Advanced algorithms extract key information and skills
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glass border-primary/20">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-semibold mb-1">Smart Scoring</h4>
                      <p className="text-sm text-muted-foreground">
                        Candidates ranked by relevance and qualifications
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;