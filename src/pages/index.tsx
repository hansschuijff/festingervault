import { AppPageShell } from "@/components/body/page-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/useTheme";
import { ShieldAlert } from "lucide-react";
import Announcements from "./_components/announcements";
import AvailableUpdates from "./_components/available-updates";
import InstallStats from "./_components/InstallStats";
import ItemStats from "./_components/ItemStats";
import LicenseStatus from "./_components/license-status";
import DashboardWelcome from "./_components/Welcome";
import { Card, CardContent } from "@/components/ui/card";

export default function Component() {
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
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-7">
        <div className="col-span-3">
          <Card className="border border-dashed border-primary-foreground bg-red-900 p-4 text-white">
            <CardContent className="flex flex-row items-center gap-5">
              <ShieldAlert size={42} />
              <div className="flex-1">
                <h2 className="text-lg">
                  Welcome to the new Festinger Vault plugin!
                </h2>
                <div className="text-sm">
                  <p>
                    The long-awaited, eagerly anticipated, and much-discussed
                    Festinger Vault plugin is FINALLY ready for download! 🥳
                  </p>
                  <p>
                    Do you have any feedback? Please let us know by clicking the
                    report feedback button! Thanks!
                  </p>
                </div>
              </div>
              <Button asChild>
                <a
                  href="https://festingervault.com/beta-feedback"
                  target="_blank"
                >
                  Report Feedback
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1 flex flex-col gap-5 lg:gap-7">
          <ItemStats />
          <InstallStats />
          <AvailableUpdates />
        </div>{" "}
        <div className="col-span-2  flex flex-col gap-5 lg:gap-7">
          <DashboardWelcome />
          <LicenseStatus />
          <Announcements />
        </div>
      </div>
    </AppPageShell>
  );
}
