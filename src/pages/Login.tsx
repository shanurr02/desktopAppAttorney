import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Input, Button } from "../components"
import iconImage from '../assets/logo/icon.png';
import CustomTitleBar from "../components/CustomTitleBar"
import { useAuth, useFormValidation } from "../hooks"
import { loginSchema, type LoginFormData, type LoginValidationErrors } from "../validation"
const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, loginError, isLoggedIn } = useAuth()
  const userType = "attorney"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string>("")
  
  // Use form validation hook
  const {
    errors: validationErrors,
    validate,
    clearFieldError,
    clearAllErrors,
  } = useFormValidation<LoginValidationErrors>(loginSchema)

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/app/dashboard")
    }
  }, [isLoggedIn, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    clearAllErrors()

    // Validate form data
    const formData: LoginFormData = {
      email,
      password,
      userType,
    }

    // Validate with Zod using the hook
    if (!validate(formData)) {
      return
    }

    try {
      const response = await login({ email, password })
      
      // Check if user's group matches attorney
      if (response.user.group !== "attorney") {
        setError("This account is for Attorney users only.")
        return
      }
      
      navigate("/app/dashboard")
    } catch (err: any) {
      // Handle API error responses
      if (err?.response?.data?.error) {
        setError(err.response.data.error)
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err?.message) {
        setError(err.message)
      } else {
        setError("Login failed. Please check your credentials.")
      }
      console.error("Login error:", err)
      
      // Clear form fields on login failure
      setEmail("")
      setPassword("")
    }
  }

  const handleGoogleLogin = () => {
    console.log("Google login clicked")
  }

  const handleForgotPassword = async () => {
    try {
      // Use Electron API to open external URL in default browser
      if ((window as any).electronAPI) {
        await (window as any).electronAPI.openExternal("https://casefunders.inverosoft.com/forgot_password/");
      } else {
        // Fallback for web version
        window.open("https://casefunders.inverosoft.com/forgot_password/", "_blank");
      }
    } catch (error) {
      console.error("Failed to open forgot password URL:", error);
      // Fallback to window.open
      window.open("https://casefunders.inverosoft.com/forgot_password/", "_blank");
    }
  }


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // Clear validation error for email
    clearFieldError('email')
    // Clear all errors when user starts typing
    setError("")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    // Clear validation error for password
    clearFieldError('password')
    // Clear all errors when user starts typing
    setError("")
  }


  return (
    <div className="max-h-screen overflow-hidden">
      <CustomTitleBar title="Case Funders" />

      <div className="h-screen bg-gray-100 flex items-center justify-center">

        <div className="bg-white rounded-md border-[1px] border-gray-200 shadow-sm p-6 w-full max-w-lg">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <img src={iconImage} alt="Case Funders" className="w-12 h-12" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">Welcome back</h1>
            <p className="text-gray-600 font-medium">Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                autoComplete="email"
                className={validationErrors.email ? 'border-red-300 focus:border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className={validationErrors.password ? 'border-red-300 focus:border-red-500' : ''}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>

            {/* Login Link */}
            {/* <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                  Log in
                </button>
              </p>
            </div> */}

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleGoogleLogin}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
            >
              Continue with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
