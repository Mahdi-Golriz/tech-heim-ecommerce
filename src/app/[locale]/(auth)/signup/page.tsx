import GoogleProviderButton from "@/components/auth/google-provider-button";
import SignUpForm from "@/components/forms/signup-form";

const SignUpPage = () => {
  return (
    <>
      <SignUpForm />
      <div className="flex items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-4 text-gray-600">Or Log In with</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <GoogleProviderButton />
    </>
  );
};

export default SignUpPage;
