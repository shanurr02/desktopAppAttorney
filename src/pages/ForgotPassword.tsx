import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input, Button } from "../components"
import iconImage from '../assets/logo/icon.png';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/app/reset-password")
    console.log("Forgot password attempt:", { email })
  }

  const handleBackToLogin = () => {
    navigate("/app/login")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-md border-[1px] border-gray-200 shadow-sm p-6 w-full max-w-lg">
        {/* Icon */}
        <div className="flex justify-center mb-6">
            <img src={iconImage} alt="Case Funders" className="w-12 h-12" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Forgot password?</h1>
          <p className="text-gray-600 font-medium">No worries, we'll send you reset instructions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoComplete="email"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            onClick={() => handleSubmit}   
          >
            Reset password
          </Button>

          {/* Back to Login Link */}
          <div className="text-center">
              <button 
                type="button" 
                onClick={handleBackToLogin}
                className="text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" /> Back to log in
              </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
