import { z } from "zod";
import { ItemTypeEnum } from "./item";

export type AutoupdatePostSchema = {
	type: Exclude<z.infer<typeof ItemTypeEnum>,"elementor-template-kits">;
	slug: string;
	enabled: boolean;
  };
