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
import bcrypt from 'bcryptjs'
import { motion, Variants } from "framer-motion"
import { 
  Quote, 
  Sparkles, 
  Target, 
  Zap,
  CheckCircle,
  Code2,
  Users,
  Rocket,
  Crown,
  Gem,
  Star,
  Shield,
  Award,
  Zap as Lightning
} from "lucide-react"

type props = {
  name: string;
  email: string
  password: string
  confirmPassword: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [form, setForm] = useState<props>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [formError, setError] = useState<props>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const hashPassword = bcrypt.hashSync(form.password, 10)

  const validateForm = () => {
    const newErrors: props = { name: '', email: '', password: '', confirmPassword: '' }

    if (!form.name.trim()) newErrors.name = "Name is Required"
    if (!form.email.trim()) newErrors.email = "Email is Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Please Enter Valid Email"

    if (!form.password.trim()) newErrors.password = "Password Required"
    else if (form.password.length < 6) newErrors.password = "Password Must be 6 Characters"

    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Password doesn't Match"

    setError(newErrors)

    return Object.values(newErrors).every(err => err == '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSignUp = async () => {
    if (!validateForm()) return;

    // ✅ 1. Signup in Supabase Auth
    const { error } = await supabaseClient.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
      },
    });

    if (error) {
      console.log("Signup error:", error.message);
      alert(error.message);
      return; // ❗ STOP if auth failed
    }

    // ✅ 2. Insert into users table
    const { error: tableError } = await supabaseClient
      .from("users")
      .insert({
        email: form.email,
        full_name: form.name,
        password: hashPassword,
        confirm_at: false,
        role: "student",
        created_by: "unkown"
      });

    if (tableError) {
      console.log("Users table error:", tableError.message);
      alert("Account created but profile not saved. Contact admin.");
      return;
    }

    // ✅ 3. Success → redirect
    alert("User created successfully! Please check your email to confirm.");
    router.push("/auth/login");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const iconVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const statItemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        type: "tween",
        duration: 0.2
      }
    }
  };

  const errorMessageVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        duration: 0.2
      }
    }
  };

  const floatingElementVariants: Variants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const floatingElementVariants2: Variants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.2, 0.4, 0.2],
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        delay: 1
      }
    }
  };

  const buttonHoverVariants: Variants = {
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Brand & Content with Premium Colors */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #faf5ff 0%, #f0f9ff 25%, #fefce8 50%, #f0fdf4 75%, #fef2f2 100%)",
          backgroundSize: "300% 300%"
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Gradient Background */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse" as const,
          }}
          style={{
            background: "linear-gradient(135deg, #faf5ff 0%, #f0f9ff 25%, #fefce8 50%, #f0fdf4 75%, #fef2f2 100%)",
            backgroundSize: "300% 300%",
          }}
        />

        {/* Floating Decorative Elements */}
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(199, 210, 254, 0.15) 0%, rgba(199, 210, 254, 0) 70%)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse" as const,
          }}
        />

        <motion.div 
          className="absolute bottom-20 left-20 w-48 h-48 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(253, 230, 138, 0.15) 0%, rgba(253, 230, 138, 0) 70%)"
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse" as const,
            delay: 2,
          }}
        />

        <motion.div 
          className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(167, 243, 208, 0.1) 0%, rgba(167, 243, 208, 0) 70%)"
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse" as const,
            delay: 4,
          }}
        />

        <div className="relative z-10">
          <motion.div 
            className="max-w-lg mx-auto space-y-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Premium Brand Logo */}
            <motion.div className="space-y-6" variants={itemVariants}>
              <div className="flex flex-col items-start gap-4">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 via-purple-200 to-cyan-200 rounded-2xl blur-lg opacity-50"></div>
                  <div className="relative flex items-center gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg">
                    <div className="relative">
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.7 }}
                      >
                        <Crown className="h-8 w-8 text-white" />
                      </motion.div>
                      <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity }}
                      >
                        <Sparkles className="h-4 w-4 text-amber-400" />
                      </motion.div>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                        Vairaa Coders
                      </h1>
                      <p className="text-sm text-gray-600 font-medium mt-1">Premium Coding Academy</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="flex gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[Star, Gem, Award, Shield].map((Icon, index) => (
                    <motion.div
                      key={index}
                      className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-white/40"
                      whileHover={{ y: -5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="h-5 w-5 text-gray-600" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Premium Quote Section */}
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <div className="absolute -left-2 -top-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <Quote className="h-10 w-10 text-amber-300/40" />
                </motion.div>
              </div>
              <div className="pl-10 pr-6 py-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
                <blockquote className="space-y-4">
                  <p className="text-2xl font-bold text-gray-800 leading-relaxed bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent">
                    Success starts with self-belief
                  </p>
                  <p className="text-gray-600 font-medium">
                    Every great coder began with a single line of code. Your journey to mastery begins here.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <Lightning className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-semibold text-gray-700">Premium Learning Experience</span>
                  </div>
                </blockquote>
              </div>
            </motion.div>

            {/* Premium Features */}
            <motion.div variants={itemVariants}>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Premium Features
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Sparkles, text: "AI-Powered Learning", color: "text-amber-500", bg: "bg-amber-50" },
                    { icon: Target, text: "Real Industry Projects", color: "text-emerald-500", bg: "bg-emerald-50" },
                    { icon: Users, text: "Mentor Support", color: "text-blue-500", bg: "bg-blue-50" },
                    { icon: Rocket, text: "Career Acceleration", color: "text-purple-500", bg: "bg-purple-50" },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-center gap-3 p-4 ${feature.bg} rounded-xl border border-white/40 shadow-sm backdrop-blur-sm`}
                      whileHover="hover"
                      variants={iconVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className={`p-2 rounded-lg ${feature.bg} ${feature.color.replace('text-', 'bg-')} bg-opacity-20`}>
                        <feature.icon className={`h-5 w-5 ${feature.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Premium Stats */}
            <motion.div 
              className="pt-6 border-t border-gray-100/50"
              variants={itemVariants}
            >
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "10K+", label: "Elite Students", icon: Users, color: "text-blue-600" },
                  { value: "500+", label: "Live Projects", icon: Code2, color: "text-emerald-600" },
                  { value: "98%", label: "Success Rate", icon: Award, color: "text-amber-600" },
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm"
                    variants={statItemVariants}
                    whileHover="hover"
                  >
                    <div className={`inline-flex items-center justify-center w-10 h-10 ${stat.color.replace('text-', 'bg-')} bg-opacity-10 rounded-full mb-2`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Premium Sign Up Content */}
            <motion.div 
              className="pt-6"
              variants={itemVariants}
            >
              <div className="space-y-4 p-6 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Why Join Elite Program?
                </h3>
                <ul className="space-y-3">
                  {[
                    "Learn from Top Industry Experts",
                    "Build Portfolio with Real Projects",
                    "1:1 Career Guidance Sessions",
                    "Access Premium Learning Resources",
                    "Join Exclusive Community",
                    "Get Certified & Job Ready"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-3 text-gray-700"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="p-1 bg-emerald-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Premium Badge */}
            <motion.div
              className="pt-4"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/50">
                <Gem className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-800">Trusted by Fortune 500 Companies</span>
                <Shield className="h-4 w-4 text-amber-600" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column - Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="w-full max-w-md relative">
          {/* Mobile Brand Logo */}
          <motion.div 
            className="lg:hidden mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.div
                className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Crown className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Vairaa Coders
                </h1>
                <p className="text-sm text-gray-600">Premium Coding Academy</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form className={cn("flex flex-col gap-6", className)} {...props} action={handleSignUp}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <motion.h1 
                    className="text-2xl font-bold"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    Join Elite Program
                  </motion.h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Start your journey to become a premium developer
                  </p>
                </div>
                
                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="John Doe" 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                    {formError.name && (
                      <motion.p 
                        variants={errorMessageVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-red-500 text-sm mt-1"
                      >
                        {formError.name}
                      </motion.p>
                    )}
                  </Field>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="m@example.com" 
                      name="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                    <FieldDescription>
                      We&apos;ll use this to contact you. We will not share your email
                      with anyone else.
                    </FieldDescription>
                    {formError.email && (
                      <motion.p 
                        variants={errorMessageVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-red-500 text-sm mt-1"
                      >
                        {formError.email}
                      </motion.p>
                    )}
                  </Field>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input 
                      id="password" 
                      type="password" 
                      name="password" 
                      value={form.password} 
                      onChange={handleChange} 
                      className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                    {formError.password && (
                      <motion.p 
                        variants={errorMessageVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-red-500 text-sm mt-1"
                      >
                        {formError.password}
                      </motion.p>
                    )}
                  </Field>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      name="confirmPassword" 
                      value={form.confirmPassword} 
                      onChange={handleChange} 
                      className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                    <FieldDescription>Please confirm your password.</FieldDescription>
                    {formError.confirmPassword && (
                      <motion.p 
                        variants={errorMessageVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-red-500 text-sm mt-1"
                      >
                        {formError.confirmPassword}
                      </motion.p>
                    )}
                  </Field>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Field>
                    <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create Premium Account
                      </Button>
                    </motion.div>
                  </Field>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FieldSeparator>Or continue with</FieldSeparator>
                  <Field>
                 
                    <FieldDescription className="px-6 text-center">
                      Already have an account? <Link href="/auth/login" className="text-amber-600 hover:text-amber-800 font-medium">Sign in</Link>
                    </FieldDescription>
                  </Field>
                </motion.div>
              </FieldGroup>
            </form>
          </motion.div>

          {/* Floating Elements for Animation */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32 bg-amber-100/20 rounded-full blur-3xl"
            variants={floatingElementVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-purple-100/20 rounded-full blur-3xl"
            variants={floatingElementVariants2}
            animate="animate"
          />
        </div>
      </motion.div>
    </div>
  )
}