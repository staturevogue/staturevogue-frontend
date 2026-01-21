import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from "../services/api"; // Import your API service

export default function Login() {
  const navigate = useNavigate();
  
  // State
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      navigate("/user");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 1. EMAIL/PASSWORD SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic Validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        setIsLoading(false);
        return;
    }

    try {
        let loginResponse;

        if (isLogin) {
            // Login Logic
            loginResponse = await authService.login({
                email: formData.email,
                password: formData.password
            });
        } else {
            // Signup Logic
            await authService.signup({
                email: formData.email,
                password: formData.password,
                first_name: formData.fullName, 
            });
            
            // Auto-login after signup
            loginResponse = await authService.login({
                email: formData.email,
                password: formData.password
            });
            toast.success("Account created successfully!");
        }

        // Store Token & Redirect
        const token = loginResponse.access || loginResponse.key || loginResponse.token;
        if (token) {
            localStorage.setItem("userToken", token);
            toast.success(isLogin ? "Welcome back!" : "Welcome to StatureVogue!");
            navigate("/user");
        } else {
            toast.error("Authentication successful, but no token received.");
        }

    } catch (error: any) {
        console.error("Auth Error:", error);
        // Error Handling
        let message = "Something went wrong.";
        if (error.email) message = `Email: ${error.email[0]}`;
        else if (error.password) message = `Password: ${error.password[0]}`;
        else if (error.detail) message = error.detail;
        else if (error.non_field_errors) message = error.non_field_errors[0];
        
        toast.error(message);
    } finally {
        setIsLoading(false);
    }
  };

  // --- 2. GOOGLE LOGIN ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const res = await authService.googleLogin({
          code: tokenResponse.code,
        });

        const token = res.key || res.access || res.token;
        
        if (token) {
          localStorage.setItem("userToken", token);
          toast.success("Logged in with Google!");
          navigate("/user");
        }
      } catch (err) {
        console.error("Google Auth Failed", err);
        toast.error("Google Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Login Failed");
    },
    flow: 'auth-code', // Important for Backend Validation
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#1F2B5B] mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-gray-600">
            {isLogin ? "Sign in to access your orders" : "Join StatureVogue for exclusive deals"}
          </p>
        </div>
        
       <form
  className="mt-8 space-y-6"
  onSubmit={handleSubmit}
  autoComplete="off"
>

          <div className="rounded-md shadow-sm space-y-4">
            
            {/* Full Name (Signup Only) */}
            {!isLogin && (
              <div className="animate-fade-in-up">
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Full Name" 
                  className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1F2B5B] focus:border-[#1F2B5B] sm:text-sm" 
                />
              </div>
            )}

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                autoComplete="new-email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email address"
                className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300"
              />

            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 pr-10"
              />

               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
            </div>

            {/* Confirm Password (Signup Only) */}
            {!isLogin && (
              <div className="animate-fade-in-up">
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm Password"
                />

              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1F2B5B] hover:bg-[#283747] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F2B5B] transition-all disabled:opacity-70"
            >
               {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (isLogin ? "Sign in" : "Sign up")}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <button 
            type="button" 
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-3 px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F2B5B]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="text-center text-sm">
          <span className="text-gray-600">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
          <button 
            onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ fullName: '', email: '', password: '', confirmPassword: '' }); // Reset form
            }} 
            className="font-medium text-[#1F2B5B] hover:text-[#162045]"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}