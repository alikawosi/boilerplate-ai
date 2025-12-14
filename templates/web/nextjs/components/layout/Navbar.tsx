import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 font-bold">
          BoilerplateAI
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Link
              href="/pricing"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
