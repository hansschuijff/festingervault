import { z } from "zod";
import { CollectionResponse } from "./api";
export const ItemTypeEnum = z.enum([
  "wordpress-themes",
  "wordpress-plugins",
  "elementor-template-kits",
]);

export const AccessEnum=z.enum([
	"gold",
	"bronze",
	"silver",
])
type VirusTotal={
	filename:string;
	hash:string;
	result:string;
	stats:Record<string, number>;
	updated:number;
}
export type PostItemType<Ex = never> = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  type: Exclude<z.infer<typeof ItemTypeEnum>,Ex>;
  author: string;
  category: string;
  updated: number;
  created: number;
  version: string;
  owned: boolean;
  access?: z.infer<typeof AccessEnum>;
  installed_version?: string;
	additional_content_count?:number;
	download_count?:number;
	install_count?:number;
	media_count?:number;
	preview?:string;
	support_url?:string;
	virus_total?:VirusTotal;
};
export type PostChangelogType={
	id:number;
	filename:string;
	version:string;
	slug:string;
	size:number;
	updated:number;
};
export type PostItemCollectionResponse = CollectionResponse<PostItemType>;
export type PostChangelogCollectionResponse = CollectionResponse<PostChangelogType>;
export type ItemStatsResponse = {
  total: number;
  themes: number;
  plugins: number;
  kits: number;
};
export type ThemePluginItemType=PostItemType<"elementor-template-kits">;
