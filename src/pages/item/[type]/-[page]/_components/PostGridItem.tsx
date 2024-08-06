import InstallButton from "@/components/install-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useInstall from "@/hooks/useInstall";
import { cn } from "@/lib/utils";
import { PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import { Clock, Ellipsis, Eye, Info, Star } from "lucide-react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

export function PostGridItemSkeleton() {
  return (
    <Card>
      <CardHeader className="aspect-video overflow-hidden rounded-t-sm p-0 sm:p-0">
        <Skeleton className="aspect-video rounded-none rounded-t-sm" />
      </CardHeader>
      <CardContent className="mt-4 space-y-2 pb-0">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}
type Props = {
  item: PostItemType;
};
export default function PostGridItem({ item }: Props) {
  const navigate = useNavigate();
  const { isInstalled } = useInstall(item);

  return (
    <Card className="group/item flex flex-col justify-between transition-all duration-300">
      <div>
        <CardHeader className="group/image relative aspect-video overflow-hidden rounded-t-sm bg-slate-400 p-0 sm:p-0">
          {item.image && (
            <Link to={`/item/${item.type}/detail/${item.id}`}>
              <img
                src={item.image}
                className="aspect-video rounded-t-sm object-cover"
              />
            </Link>
          )}
          {item.version && (
            <Badge
              className={cn([
                "absolute bottom-1 flex items-center gap-1 rounded-sm uppercase transition-opacity group-hover/image:opacity-80",
                "left-1",
              ])}
              variant="background"
              title="Version"
            >
              {item.version}
            </Badge>
          )}
          {item.access && (
            <Badge
              className={cn([
                "absolute bottom-1 flex items-center gap-1 rounded-sm uppercase transition-opacity",
                "right-1 border-0",
              ])}
              variant={item.access}
            >
              {item.access}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-1">
          <CardTitle className="leading-normal">
            <Link to={`/item/${item.type}/detail/${item.id}`}>
              {decodeEntities(item.title)}
            </Link>
          </CardTitle>
          <CardDescription className="line-clamp-2">
            In {item.category}
          </CardDescription>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex items-center gap-1 text-xs">
              <Clock width={11} /> {moment.unix(item.updated).fromNow()}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Info width={11} /> {item.version}
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <div className="flex flex-row gap-2 pt-3 items-center">
          <InstallButton item={item} />
          <Button
            variant="outline"
            size="icon"
            className="flex items-center gap-2"
            onClick={e => {
              navigate(`/item/${item.type}/detail/${item.id}`);
            }}
          >
            <Eye width={16} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="flex items-center gap-2"
            onClick={e => {
              //navigate(`/item/${item.type}/detail/${item.id}`);
            }}
          >
            <Star width={16} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="flex items-center gap-2"
            onClick={e => {
              //navigate(`/item/${item.type}/detail/${item.id}`);
            }}
          >
            <Ellipsis width={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
