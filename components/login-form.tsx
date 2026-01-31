'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { supabaseClient } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FiMail, FiLock, FiArrowRight, FiCheckCircle, FiUsers, FiBarChart2, FiShield } from "react-icons/fi"
import { LuSparkles } from "react-icons/lu"

type props = {
  email: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [form, setForm] = useState<props>({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const [formError, setError] = useState<props>({
    email: '',
    password: '',
  })

  const validateForm = () => {
    const newErrors: props = { email: '', password: '' }

    if (!form.email.trim()) newErrors.email = "Email is Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Please Enter Valid Email"

    if (!form.password.trim()) newErrors.password = "Password Required"
    else if (form.password.length < 6) newErrors.password = "Password Must be 6 Characters"

    setError(newErrors)

    return Object.values(newErrors).every(err => err == '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (formError[e.target.name as keyof props]) {
      setError(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)

    try {
      const { data: user, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('email', form.email)
        .single()

      if (error || !user) {
        alert("User Not Found")
        setLoading(false)
        return
      }

      if (!user.confirm_at) {
        alert("You cannot login. Waiting for Admin Approval")
        setLoading(false)
        return;
      }

      const { data: { session }, error: authError } = await supabaseClient.auth.signInWithPassword(
        {
          email: form.email,
          password: form.password
        }
      )

      if (authError || !session) {
        alert(authError?.message || "Login failed");
        setLoading(false)
        return;
      }

      await fetch('/api/set-cookie', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: session?.access_token })
      })
      
      // Show success animation before redirect
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)

    } catch (error) {
      console.error("Login error:", error)
      alert("An error occurred during login")
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <FiUsers className="text-xl" />,
      title: "Smart User Management",
      description: "Manage users with advanced role-based permissions"
    },
    {
      icon: <FiBarChart2 className="text-xl" />,
      title: "Real-time Analytics",
      description: "Track progress with interactive dashboards"
    },
    {
      icon: <FiShield className="text-xl" />,
      title: "Enterprise Security",
      description: "Bank-level security with 2FA protection"
    },
    {
      icon: <LuSparkles className="text-xl" />,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations and insights"
    }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">VC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Vairaa Coders
              </h1>
              <p className="text-sm text-amber-600">Task Management System</p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back 👋</h2>
            <p className="text-gray-600">Sign in to continue to your dashboard</p>
          </div>

          <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSignIn} {...props}>
            <FieldGroup>
              {/* Email Field */}
              <div className="space-y-2">
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange}
                    className="pl-10 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 border-amber-200"
                  />
                </div>
                {formError.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm"
                  >
                    {formError.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange}
                    className="pl-10 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 border-amber-200"
                  />
                </div>
                {formError.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm"
                  >
                    {formError.password}
                  </motion.p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-amber-300 text-amber-500 focus:ring-amber-200" />
                  Remember me
                </label>
                <a
                  href="/auth/forgot-password"
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <FiArrowRight />
                  </span>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" type="button" className="border-amber-200 hover:bg-amber-50">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="border-amber-200 hover:bg-amber-50">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don not have an account?{" "}
                  <Link 
                    href="/auth/signup" 
                    className="font-semibold text-amber-600 hover:text-amber-700 underline-offset-2 hover:underline"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </FieldGroup>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Premium Content */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-300 opacity-90"></div>
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <FiCheckCircle className="text-lg" />
              <span className="font-semibold">Trusted by 500+ Companies</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Elevate Your
              <span className="block text-white/90">Task Management</span>
            </h1>

            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Join thousands of teams who use Vairaa Coders to streamline workflows, 
              boost productivity, and achieve remarkable results.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-white/70">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-white/70">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/70">Support</div>
              </div>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <p className="italic text-white/90 mb-4">
                Vairaa Coders transformed how our team manages projects. The intuitive interface 
                and powerful features saved us countless hours.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-white/30 to-white/10"></div>
                <div>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-white/70">CTO at TechFlow Inc.</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-white/10 to-white/5 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-gradient-to-r from-white/5 to-white/10 blur-xl"></div>
      </div>
    </div>
  )
}