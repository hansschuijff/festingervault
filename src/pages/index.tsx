import { AppPageShell } from "@/components/body/page-shell";
import useTheme from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import Announcements from "./_components/announcements";
import AvailableUpdates from "./_components/available-updates";
import InstallStats from "./_components/InstallStats";
import ItemStats from "./_components/ItemStats";
import LicenseStatus from "./_components/license-status";
import DashboardWelcome from "./_components/Welcome";

export default function Component() {
  const { effectiveTheme } = useTheme();
  console.log(effectiveTheme);
  return (
    <AppPageShell
      title="Dashboard"
      description="Festingervault Dashboard"
      breadcrump={[
        {
          label: "Dashboard",
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-5 lg:gap-7 lg:grid-cols-3">
        <div className="col-span-1">
          <ItemStats />
        </div>
        <DashboardWelcome className="lg:col-span-2" />
        <InstallStats className="lg:col-span-1 lg:aspect-square" />
        <LicenseStatus className={cn("lg:col-span-2")} />
        <AvailableUpdates />
        <Announcements className={cn("lg:col-span-2")} />
      </div>
    </AppPageShell>
  );
}
