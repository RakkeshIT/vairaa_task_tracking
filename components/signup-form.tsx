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

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} action={handleSignUp}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" type="text" placeholder="John Doe" name="name" value={form.name} onChange={handleChange} />
          {formError.name && <p className="text-red-500">{formError.name}</p>}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" name="email" value={form.email} onChange={handleChange} />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
          {formError.email && <p className="text-red-500">{formError.email}</p>}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" name="password" value={form.password} onChange={handleChange} />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          {formError.password && <p className="text-red-500">{formError.password}</p>}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input id="confirm-password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
          <FieldDescription>Please confirm your password.</FieldDescription>
          {formError.confirmPassword && <p className="text-red-500">{formError.confirmPassword}</p>}
        </Field>
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Sign up with GitHub
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/auth/login">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
