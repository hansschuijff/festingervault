import { CollectionResponse } from "./api";
import { PostItemType, PostMediaType } from "./item";

export type HistoryItemType={
	id:number;
	type: "download" | "install" | "update" | "download_additional";
	media?:PostMediaType;
	item:PostItemType;
	created:number;
}
export type HistoryCollectionType=CollectionResponse<HistoryItemType>;
