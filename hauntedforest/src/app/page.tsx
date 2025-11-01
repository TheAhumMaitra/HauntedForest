import HeroSection from "@/components/Hero";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen! justify-center items-center">
        <HeroSection />
      </div>
      <Alert className="gap-6">
        <AlertTitle>This website is still under creation</AlertTitle>
        <AlertDescription>
          This website can cause any errors. I am sorry. Thanks for your
          understanding.
        </AlertDescription>
      </Alert>
    </>
  );
}
