import { z } from "zod";
import { EnumItemType } from "./item";

export const settingSchema=z.object({
	autoactivate:z.boolean().default(false),
	clean_on_uninstall:z.boolean().default(false),
	roles:z.array(z.string()),
})
