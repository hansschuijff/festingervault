import { AppPageShell } from "@/components/body/page-shell";
import useInstalled from "@/hooks/use-is-installed";
import { __ } from "@wordpress/i18n";
import UpdatesTable, { UpdatesTableSkeleton } from "./_components/updates-table";
export default function Component() {
  const { list, isLoading } = useInstalled();
  return (
    <AppPageShell
      title={__("Updates", 'festingervault')}
      isLoading={isLoading}
      preloader={<UpdatesTableSkeleton />}
			breadcrump={[
				{
					label:__("Updates", 'festingervault')
				}
			]}
    >
      {list && <UpdatesTable data={list} />}
    </AppPageShell>
  );
}
