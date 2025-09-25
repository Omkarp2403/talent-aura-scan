import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Brain, Eye, EyeOff, Lock, User, Mail, ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterFormData>({
    mode: "onChange"
  });

  const watchPassword = watch("password", "");
  const watchConfirmPassword = watch("confirmPassword", "");

  // Calculate password strength
  React.useEffect(() => {
    const calculateStrength = (password: string) => {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      return strength;
    };
    setPasswordStrength(calculateStrength(watchPassword));
  }, [watchPassword]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-destructive";
    if (passwordStrength < 75) return "bg-warning";
    return "bg-success";
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 25) return "Very Weak";
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError("");

    try {
      // Import API dynamically to avoid circular imports
      const { default: api } = await import("@/services/api");
      
      const registerData = {
        username: data.username,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
        password_confirm: data.confirmPassword,
      };

      const result = await api.auth.register(registerData);
      
      if (result.success) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to ResumeAI. You can now start screening resumes.",
        });

        // Redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 ai-particles">
      <div className="w-full max-w-md space-y-6">
        {/* Back to home */}
        <Button
          variant="ghost"
          className="mb-4 hover:bg-primary/10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Register Card */}
        <Card className="glass-card hover-glow animate-fade-in-up">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center pulse-glow">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold font-poppins">
              Create Account
            </CardTitle>
            <CardDescription className="text-base">
              Join ResumeAI and transform your hiring process
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-fade-in">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="h-12 glass border-primary/20 focus:border-primary/40"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters"
                      }
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive animate-fade-in">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="h-12 glass border-primary/20 focus:border-primary/40"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters"
                      }
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive animate-fade-in">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10 h-12 glass border-primary/20 focus:border-primary/40"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address"
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive animate-fade-in">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    className="pl-10 h-12 glass border-primary/20 focus:border-primary/40"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters"
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: "Username can only contain letters, numbers, and underscores"
                      }
                    })}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-destructive animate-fade-in">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 h-12 glass border-primary/20 focus:border-primary/40"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                      }
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {watchPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className={`font-medium ${passwordStrength >= 75 ? 'text-success' : passwordStrength >= 50 ? 'text-warning' : 'text-destructive'}`}>
                        {getPasswordStrengthLabel()}
                      </span>
                    </div>
                    <Progress 
                      value={passwordStrength} 
                      className="h-2"
                    />
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-destructive animate-fade-in">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 h-12 glass border-primary/20 focus:border-primary/40"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: value => value === watchPassword || "Passwords do not match"
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {watchConfirmPassword && (
                  <div className="flex items-center space-x-2 text-xs">
                    {watchPassword === watchConfirmPassword ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-success" />
                        <span className="text-success">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-destructive" />
                        <span className="text-destructive">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive animate-fade-in">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300"
                disabled={loading || !isValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center pt-6 border-t border-border/20">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-glow font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;