import { login, signup } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <form className="flex w-full max-w-sm flex-col gap-6 border p-8 rounded-lg shadow-sm">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              required
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" required type="password" />
          </div>
          <Button formAction={login}>Sign In</Button>
          <Button variant="outline" formAction={signup}>
            Sign Up
          </Button>
        </div>

        {searchParams?.message && (
          <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
