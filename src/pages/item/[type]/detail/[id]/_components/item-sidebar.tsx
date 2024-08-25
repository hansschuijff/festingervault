import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "@/router";
import { PostItemType } from "@/types/item";
import millify from "millify";
import CountUp from "react-countup";
import ChangelogPreview from "./changelog-preview";
import ItemDetail from "./item-detail";
import VirusTotalScan from "./item-virus-total";
import ItemTerms from "./item-terms";
import { __ } from "@wordpress/i18n";

type Props = {
  item: PostItemType;
};
export default function ItemSidebar({ item }: Props) {
  const params = useParams("/item/:type/detail/:id/:tab?");
  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardContent className="grid grid-cols-2 divide-x text-center">
          <div className="p-2">
            <div className="text-2xl font-semibold">
              <CountUp
                start={0}
                end={item.download_count}
                duration={2.75}
                formattingFn={num => millify(num)}
              />
            </div>
            <div className="text-sm text-muted-foreground">{__("Downloads", 'festingervault')}</div>
          </div>
          <div className="p-2">
            <div className="text-2xl">
              <CountUp
                start={0}
                end={item.install_count}
                duration={2.75}
                formattingFn={num => millify(num)}
              />
            </div>
            <div className="text-sm text-muted-foreground">{__("Installs", 'festingervault')}</div>
          </div>
        </CardContent>
      </Card>
      <VirusTotalScan item={item} />
      <ItemDetail item={item} />
      {item.media_count > 0 && params.tab != "changelog" && (
        <ChangelogPreview item={item} />
      )}
      <ItemTerms
        title={__("Tags", 'festingervault')}
        terms={item.terms.filter(i => i.taxonomy === "post_tag")}
      />
      <ItemTerms
        title={__("Browsers", 'festingervault')}
        terms={item.terms.filter(i => i.taxonomy === "compatible-browser")}
      />
      <ItemTerms
        title={__("Compatible With", 'festingervault')}
        terms={item.terms.filter(i => i.taxonomy === "compatible-with")}
      />
      <ItemTerms
        title={__("Included Files", 'festingervault')}
        terms={item.terms.filter(i => i.taxonomy === "files-included")}
      />
      <ItemTerms
        title={__("Software Versions", 'festingervault')}
        terms={item.terms.filter(i => i.taxonomy === "software-version")}
      />
    </div>
  );
}
