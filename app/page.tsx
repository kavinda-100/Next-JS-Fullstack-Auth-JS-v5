import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import LogInButton from "../components/auth/LogInButton";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
      <section className="flex h-full flex-col justify-center items-center">
        <div className=" space-y-6 text-center">
          <h1
              className={cn(
                  "text-lg lg:text-4xl xl:5xl font-bold drop-shadow-md text-white",
                  poppinsFont.className
              )}
          >
            🔐 Auth
          </h1>
          <p className="text-sm lg:text-lg xl:text-2xl text-pretty text-white/90">
            {" "}
            Fully Authentication App with NextJS and AuthJS-v5
          </p>
          <div>
            <LogInButton asChild>
              <Button variant={"customSecondary"} size={"lg"}>
                Sign In
              </Button>
            </LogInButton>
          </div>
        </div>
      </section>
  );
}
