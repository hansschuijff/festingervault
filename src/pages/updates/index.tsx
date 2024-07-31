import { AppPageShell } from "@/components/body/page-shell";
import useInstalled from "@/hooks/use-is-installed";
import UpdatesTable, { UpdatesTableSkeleton } from "./_components/updates-table";
import { __ } from "@wordpress/i18n";
export default function Component() {
  const { list, isLoading } = useInstalled();
  return (
    <AppPageShell
      title={__("Updates")}
      isLoading={isLoading}
      preloader={<UpdatesTableSkeleton />}
			breadcrump={[
				{
					label:__("Updates")
				}
			]}
    >
      {list && <UpdatesTable data={list} />}
    </AppPageShell>
  );
}
