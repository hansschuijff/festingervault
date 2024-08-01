import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import useInstalled from "@/hooks/use-is-installed";
import { cn } from "@/lib/utils";
import { Link } from "@/router";
import { __ } from "@wordpress/i18n";
import moment from "moment";
import { ClassNameValue } from "tailwind-merge";

type Props = {
  className?: ClassNameValue;
};
export default function AvailableUpdates({ className }: Props) {
  const { updateable } = useInstalled();
  return (
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardHeader className="border-b sm:p-4 sm:pb-4">
        <h3 className="text-lg">{__("Item Updates")}</h3>
      </CardHeader>
      <div className="px-0">
        {updateable && updateable?.length > 0 ? (
          <div className="divide-y text-sm">
            {updateable.slice(0, 4).map(item => (
              <div key={item.id} className="flex flex-col gap-2 p-4">
                <div>
                  <Link
                    to="/item/:type/detail/:id"
                    params={{
                      id: item.id,
                      type: item.type,
                    }}
                  >
                    {item.title}
                  </Link>
                </div>
                <div className="flex flex-row justify-between gap-4">
                  <div className="text-muted-foreground">
                    Available: {item.version}
                  </div>
                  <div className="text-muted-foreground">
                    Installed: {item.installed_version}
                  </div>
                  <div className="text-muted-foreground">
                    {moment.unix(item.updated).fromNow()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm italic text-muted-foreground">
            No Update Found
          </div>
        )}
      </div>
      <CardFooter className="justify-center border-t border-border pt-4 text-center sm:p-4 sm:pt-4">
        <Link
          to="/updates"
          className="border-b border-dashed border-blue-500 text-blue-500"
        >
          View All Updates
        </Link>
      </CardFooter>
    </Card>
  );
}
