import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { PostItemType } from "@/types/item";
import capitalizeHyphenatedWords from "@/utils/capitalizeHyphenatedWords";
import { Calendar, CheckCircle2 } from "lucide-react";
import moment from "moment";
export function ItemDetailHeaderSkeleton(){
	return (
    <div className="relative flex flex-col items-center gap-3 p-6 py-12">
      <Grid size={50} />
      <div>
				<Skeleton className="aspect-video h-52 rounded-md" />
      </div>
			<Skeleton className="w-52 h-5" />

    </div>
  );
}
type Props = {
  item: PostItemType;
};
export default function ItemDetailHeader({ item }: Props) {
  return (
    <div className="relative flex flex-col items-center gap-3 p-6 py-12">
      <Grid size={50} />
      <div>
        <img src={item.image} className="aspect-video h-52 rounded-md" />
      </div>
      <h1 className="text-xl">{item.title}</h1>
      <div className="flex flex-row gap-5 text-sm text-muted-foreground">
        <div className="space-x-2">
          <span>In</span>
          <span>{capitalizeHyphenatedWords(item.category)}</span>
        </div>
        <div className="flex flex-row items-center gap-1 text-green-600">
          {moment
            .unix(item.updated)
            .isBefore(moment("today").add(1, "week")) ? (
            <>
              <CheckCircle2 size={18} /> <span>Recently Updated</span>
            </>
          ) : (
            <>
              <Calendar size={18} />{" "}
              <span>{moment.unix(item.updated).fromNow()}</span>
            </>
          )}
        </div>
        {item.additional_content_count > 0 && (
          <div className="flex flex-row items-center gap-1 text-green-600">
            <CheckCircle2 size={18} />
            <span>Demo Included</span>
          </div>
        )}
      </div>
    </div>
  );
}
