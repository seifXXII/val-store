import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupForm } from "./SignupForm";
import { GoogleSignInButton } from "../login/GoogleSignInButton";
import { FacebookSignInButton } from "../login/FacebookSignInButton";

export function SignupCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create your Val Store account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email/Password Form */}
        <SignupForm />

        {/* OR Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <GoogleSignInButton />
          <FacebookSignInButton />
        </div>
      </CardContent>
    </Card>
  );
}
