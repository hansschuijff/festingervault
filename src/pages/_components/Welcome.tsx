import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
type Props = {
  className?: ClassNameValue;
};
export default function DashboardWelcome({ className }: Props) {
  return (
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardContent className="p-4 sm:p-6">
        <div>Welcome Notice</div>
      </CardContent>
      <CardFooter className="justify-center border-t border-border text-center sm:p-4 sm:pt-4">
        <a
          href=""
          className="border-b border-dashed border-blue-500 text-blue-500"
        >
          Get Started
        </a>
      </CardFooter>
    </Card>
  );
}
