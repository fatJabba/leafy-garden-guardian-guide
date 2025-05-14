
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { SignUpForm } from "@/components/AuthForms";

const SignUp = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight text-center mb-6">Get Started</h1>
          <SignUpForm />
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-garden-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
