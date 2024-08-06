import { AppPageShell } from "@/components/body/page-shell";
import useApiFetch from "@/hooks/useApiFetch";
import { useParams } from "@/router";
import { HistoryCollectionType } from "@/types/history";
import { __ } from "@wordpress/i18n";
import HistoryItem from "./_components/history-item";

export default function Component() {
  const { page } = useParams("/history/:page?");
  const { data, isLoading } = useApiFetch<HistoryCollectionType>(
    "history/list",
    {
      page: Number(page ?? 1),
    },
  );
  return (
    <AppPageShell title={__("History")} isLoading={isLoading}>
      <HistoryItem data={data} />
    </AppPageShell>
  );
}
