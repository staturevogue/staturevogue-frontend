import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#1F2B5B] mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-gray-600">
            {isLogin ? "Sign in to access your orders" : "Join Staturevogue for exclusive deals"}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <div>
                <input type="text" placeholder="Full Name" className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1F2B5B] focus:border-[#1F2B5B] sm:text-sm" />
              </div>
            )}
            <div>
              <input type="email" placeholder="Email address" className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1F2B5B] focus:border-[#1F2B5B] sm:text-sm" />
            </div>
            <div>
              <input type="password" placeholder="Password" className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#1F2B5B] focus:border-[#1F2B5B] sm:text-sm" />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1F2B5B] hover:bg-[#283747] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F2B5B]">
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-[#1F2B5B] hover:text-[#F4C430]">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}