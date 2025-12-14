import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupForm } from "./SignupForm";

export function SignupCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create your Val Store account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
