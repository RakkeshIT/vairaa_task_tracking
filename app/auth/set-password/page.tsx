"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Key,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Globe,
  Users,
  Zap,
  ArrowRight
} from "lucide-react"
import Image from "next/image"
import axios from "axios"
import Logo from '../../assets/logo.png'
import  AlertDialog1 from "@/components/Alert"
export default function PremiumSecuritySetup() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsvisible] = useState(false)


  const onClose = () => {
    setIsvisible(false)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log("Form submitted:", formData)
    try {
      const res = await axios.post('/api/set-password/tem-login', { email: formData.email, password: formData.password })
      if(res.data.success){
        setIsvisible(true)
      }
    } catch (error) {
      console.log("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const premiumFeatures = [
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Free Courses and Webinars" },
    { icon: <Globe className="w-5 h-5" />, text: "Free Mentorship" },
    { icon: <Users className="w-5 h-5" />, text: "Projects Support and Development" },
    { icon: <Zap className="w-5 h-5" />, text: "AI Development" },
  ]

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16"
      >
        <div className="max-w-md mx-auto w-full ">
          {/* Logo & Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="">
                <Image src={Logo} alt="Vairaa Logo" height={50} width={50} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                Vairaa Coders
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> PREMIUM
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome to
              <span className="block bg-gradient-to-r from-purple-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Secure Setup
              </span>
            </h1>
            <p className="text-gray-600">
              Create your secure account with advanced protection
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  Email Address
                </div>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="relative w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-900 placeholder-gray-400"
                  placeholder="Enter your work email"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  Password
                </div>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="relative w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-900 placeholder-gray-400"
                  placeholder="Create a strong password"
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>


            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              {loading ? "Please Wait Processing" :"Set My Password"}

              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative px-4 bg-white">
                <span className="text-sm text-gray-500">Vairaa Student Community</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <div className="w-5 h-5 bg-gradient-to-r from-red-400 to-red-500 rounded-full" />
                <span className="text-sm font-medium text-gray-700">Instagram</span>
              </button>
              <button
                type="button"
                className="py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
                <span className="text-sm font-medium text-gray-700">LinkedIn</span>
              </button>
            </div>

            {/* Footer Links */}
            <p className="text-center text-sm text-gray-600">
              By continuing, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">Terms</a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">Privacy Policy</a>
            </p>
          </form>
        </div>
      </motion.div>

      {/* Right Side - Premium Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500 to-transparent rounded-full -translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500 to-transparent rounded-full translate-x-48 translate-y-48" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-5xl font-bold mb-6">
              Welcome to
              <span className="block bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Vairaa Coders Community
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join our vibrant community of developers learning and building together.
              Explore projects, share knowledge, and level up your coding skills with mentorship and collaboration.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-12">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                    {feature.icon}
                  </div>
                  <span className="text-lg font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-gray-400">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-gray-400">Support & Mentorship</div>
              </div>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r p-4 from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">VR</span>
                </div>
                <div>
                  <p className="text-gray-200 italic mb-3">
                    Vairaa Coders Community helped me grow from a beginner to contributing in real projects. The mentorship and collaboration here is unmatched!
                  </p>
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">Rakkesh Kumar.J</div>
                      <div className="text-gray-400 text-sm">Founder, Vairaa Coders</div>
                    </div>

                    <div>
                      <div className="font-semibold">Vaishali .S</div>
                      <div className="text-gray-400 text-sm">CEO, Vairaa Coders</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 4, delay: 1 }}
          className="absolute bottom-1/3 left-1/4 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 blur-sm"
        />
      </motion.div>
       <AlertDialog1 isVisible={isVisible} onClose={onClose} title="Email Verified" description="Password Set link sent in your mail , Please Check" />

    </div>
  )
}