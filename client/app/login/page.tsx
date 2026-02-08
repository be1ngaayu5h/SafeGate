import LoginForm from "@/components/form/login-form";
import LogoEmoji from "@/components/logo/LogoEmoji";

const Page = () => {
  return (
    <div className="h-screen p-8  w-full flex flex-col md:px-20  lg:mt-0 items-center justify-center">
      <div className="md:w-96 space-y-10 shadow-2xl p-4 rounded-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full border-[1px] p-2 bg-amber-200">
            <LogoEmoji />
          </div>
          <h1 className="text-2xl font-semibold">SafeGate</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
