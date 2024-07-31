import { AppPageShell } from "@/components/body/page-shell";
import useApiFetch from "@/hooks/useApiFetch";
import { __ } from "@wordpress/i18n";
import ActivationDetailItem, {
	ActivationDetailItemType
} from "./_components/activation-detail";
import RegisterLicenseForm from "./_components/register-license";

export default function Component() {
  const { data, isLoading, isFetching, isFetched, isError, error } =
    useApiFetch<ActivationDetailItemType>("license/detail", {});

  return (
    <AppPageShell
      title={__("License Activation")}
      isLoading={isLoading}
      isFetching={isFetching}
      breadcrump={[
        {
          label: data?.activation_key
            ? __("Activation Detail")
            : __("Activate License"),
        },
      ]}
    >
      <div>
        {data &&
          (data.activation_key ? (
            <ActivationDetailItem key={data.activation_key} item={data} />
          ) : (
            <RegisterLicenseForm />
          ))}
      </div>
    </AppPageShell>
  );
}
