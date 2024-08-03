import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

type CardHeaderProps = {
  label: string;
};

const CardHeaders = ({ label }: CardHeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1
        className={cn(
          "text-2xl md:text-3xl text-center text-black",
          poppinsFont.className
        )}
      >
        🔐 AuthJS<span className="text-sm">{" "}v5</span>
      </h1>
      <p className=" text-muted-foreground text-sm md:text-lg">{label}</p>
    </div>
  );
};

export default CardHeaders;
