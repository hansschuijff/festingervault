import { AppPageShell } from "@/components/body/page-shell";
import useApiFetch from "@/hooks/useApiFetch";
import { useParams } from "@/router";
import { HistoryCollectionType } from "@/types/history";
import { __ } from "@wordpress/i18n";
import HistoryItems from "./_components/history-items";

export default function Component() {
  const { page } = useParams("/history/:page?");
  const { data, isLoading } = useApiFetch<HistoryCollectionType>(
    "history/list",
    {
      page: Number(page ?? 1),
    },
  );
  return (
    <AppPageShell title={__("History", 'festingervault')} isLoading={isLoading}>
      <HistoryItems data={data} />
    </AppPageShell>
  );
}
