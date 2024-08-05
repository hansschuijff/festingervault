export type ActivationDetailType = {
	activation_key: string;
	domain: string;
	created: number;
	expires: number;
	status: "active" | "inactive" | "expired";
	plan_type: string;
	plan_title: string;
	total_limit: number;
	today_limit: number;
	today_limit_used: number;
  };
