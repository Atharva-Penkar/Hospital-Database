import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

type AuthFormProps = {
  type: "login" | "signup"
  onSubmit: (data: { email: string; password: string }) => void
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-md p-6">
        <CardHeader className="text-center text-2xl font-semibold capitalize mb-4">
          {type === "login" ? "Login to your account" : "Create an account"}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button className="w-full mt-2" type="submit">
              {type === "login" ? "Login" : "Sign Up"}
            </Button>
          </form>

          <div className="text-sm text-center text-gray-600 mt-4">
            {type === "login" ? (
              <p>
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <a href="/" className="text-blue-600 hover:underline">
                  Log in
                </a>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
