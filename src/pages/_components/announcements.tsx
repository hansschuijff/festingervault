import {
	Card,
	CardHeader
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { __ } from "@wordpress/i18n";
import { ClassNameValue } from "tailwind-merge";

type Props = {
  className?: ClassNameValue;
};
export default function Announcements({ className }: Props) {
	const announcements=[];
  return (
    <Card className={cn("flex flex-col ", className)}>
      <CardHeader className="flex flex-row justify-between border-b sm:p-4 sm:pb-4">
        <h3 className="text-lg">{__("Announcements")}</h3>
        <div>
          <a
            href="https://meta.festingervault.com/c/announcements/11"
            target="_blank"
            className=" border-b border-dashed border-blue-500 text-sm text-blue-500"
          >
            View All
          </a>
        </div>
      </CardHeader>
      <div className="px-0">
        {announcements && announcements?.length > 0 ? (
          <div className="divide-y text-sm">

          </div>
        ) : (
          <div className="p-4 text-center text-sm italic text-muted-foreground">
            No new announcements
          </div>
        )}
      </div>
    </Card>
  );
}
