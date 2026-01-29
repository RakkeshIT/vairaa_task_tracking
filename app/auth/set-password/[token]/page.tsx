"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  Shield,
  KeyRound,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Fingerprint,
  Zap
} from "lucide-react"
import axios, { Axios } from "axios";
import toast from "react-hot-toast";
import AlertDialog1 from "@/components/Alert";
import { useParams, useRouter } from "next/navigation";
interface Props {
  params: { token: string };
}

export default function PasswordSetupPage() {
  const params =  useParams()
  const token = params.token as string
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsvisible] = useState(false)
  const router= useRouter()
  const onClose = () => {
    setIsvisible(false)
  }
  const checkPasswordStrength = (pass: string) => {
    let score = 0
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[a-z]/.test(pass)) score++
    if (/\d/.test(pass)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++
    return score
  }

  const passwordStrength = checkPasswordStrength(password)
  const passwordMatch = password === confirmPassword && confirmPassword.length > 0

  const requirements = [
    { 
      label: "At least 8 characters", 
      met: password.length >= 8,
      description: "Longer passwords are more secure"
    },
    { 
      label: "Uppercase letter", 
      met: /[A-Z]/.test(password),
      description: "Use at least one capital letter"
    },
    { 
      label: "Lowercase letter", 
      met: /[a-z]/.test(password),
      description: "Use at least one small letter"
    },
    { 
      label: "Number", 
      met: /\d/.test(password),
      description: "Include at least one digit"
    },
    { 
      label: "Special character", 
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      description: "Add symbols for extra security"
    }
  ]

  const getStrengthColor = (strength: number) => {
    switch(strength) {
      case 0: return "from-gray-400 to-gray-500"
      case 1: return "from-red-400 to-red-500"
      case 2: return "from-orange-400 to-orange-500"
      case 3: return "from-yellow-400 to-yellow-500"
      case 4: return "from-blue-400 to-blue-500"
      case 5: return "from-green-400 to-green-500"
      default: return "from-gray-400 to-gray-500"
    }
  }

  const getStrengthText = (strength: number) => {
    switch(strength) {
      case 0: return "No password"
      case 1: return "Very Weak"
      case 2: return "Weak"
      case 3: return "Fair"
      case 4: return "Good"
      case 5: return "Excellent"
      default: return ""
    }
  }

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let newPassword = ""
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(newPassword)
    setConfirmPassword(newPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!passwordMatch || passwordStrength < 4) {
      alert("Please ensure your password is strong and matches!")
      return
    }
    try {
      const res = await axios.post('/api/set-password', {token, password})
      
      if(res.status === 200){
        setIsvisible(true)
        router.push('/auth/login')
      }
    } catch (error) {
      console.log("Password Set Error in Fron end", error)
      if(axios.isAxiosError(error)){
        const status = error.response?.status
        const message = error.response?.data?.message || "Something went Wrong"
        if(status === 400){
          toast.error(message)
        }else if(status === 410){
          toast.error(message)
        } else if (status === 500){
          toast.error(message)
        }
      } else{
        toast.error("Server error. Try again later.")
      }
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <AlertDialog1 isVisible={isVisible} onClose={onClose} title="Your Password Successfully Set" description="You are now eligible to access your account. Please Login" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Secure Password Setup</h1>
                  <p className="text-white/80">Create a strong password for enhanced security</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Premium Security</span>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Security Level</span>
              <span className="text-sm font-bold">{passwordStrength}/5</span>
            </div>
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-gradient-to-r ${getStrengthColor(passwordStrength)}`}
                initial={{ width: 0 }}
                animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Password Field */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <KeyRound className="w-5 h-5 text-purple-600" />
                    Create Password
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate Strong Password
                  </button>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 text-gray-900 placeholder-gray-400 text-lg"
                    placeholder="Enter your new password"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Strength Indicator */}
                <AnimatePresence mode="wait">
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Strength: <span className={`font-bold ${
                            passwordStrength < 3 ? "text-red-600" :
                            passwordStrength < 4 ? "text-yellow-600" :
                            "text-green-600"
                          }`}>
                            {getStrengthText(passwordStrength)}
                          </span>
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-3 h-3 rounded-full ${
                                level <= passwordStrength 
                                  ? `bg-gradient-to-r ${getStrengthColor(passwordStrength)}` 
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <Lock className="w-5 h-5 text-purple-600" />
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`relative w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 placeholder-gray-400 text-lg ${
                      confirmPassword 
                        ? passwordMatch 
                          ? "border-green-500 focus:border-green-500 focus:ring-green-100" 
                          : "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Match Indicator */}
                <AnimatePresence mode="wait">
                  {confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center gap-2 text-sm font-medium ${
                        passwordMatch ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {passwordMatch ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Passwords match perfectly!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span>Passwords don not match</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Requirements Grid */}
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  Password Requirements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {requirements.map((req, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${
                        req.met ? "bg-green-50 border border-green-200" : "bg-gray-50"
                      }`}
                    >
                      <div className={`mt-0.5 ${req.met ? "text-green-500" : "text-gray-400"}`}>
                        {req.met ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                      </div>
                      <div>
                        <div className={`font-medium ${req.met ? "text-green-700" : "text-gray-700"}`}>
                          {req.label}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {req.description}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border-2 border-blue-200 group"
                >
                  <Zap className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <div className="text-left">
                    <div className="font-semibold">Generate Strong</div>
                    <div className="text-sm text-blue-600">Auto-create secure password</div>
                  </div>
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!passwordMatch || passwordStrength < 4}
                  className={`flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    passwordMatch && passwordStrength >= 4
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                 {loading ? ("Please Wait......") : ("Set Password")}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Security Tips */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-gray-700 mb-3">
                  <Fingerprint className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Security Tips:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-800 mb-1">Unique Password</div>
                    Don not reuse passwords across different sites
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-800 mb-1">Password Manager</div>
                    Consider using a password manager
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-800 mb-1">Regular Updates</div>
                    Change passwords every 3-6 months
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center text-gray-500 text-sm border-t border-gray-200">
            <p>Your password is encrypted end-to-end. We never store plain text passwords.</p>
            <p className="mt-1">By setting up your password, you agree to our <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">Security Policy</a></p>
          </div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-10 right-10 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-sm opacity-50 -z-10"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 4, delay: 1 }}
          className="absolute bottom-10 left-10 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 blur-sm opacity-30 -z-10"
        />
      </motion.div>
    </div>
  )
}