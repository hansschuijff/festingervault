import { z } from "zod";
import { PostItemType } from "./item";

export type BookmarkCollectionType = {
	id: number;
	title: string;
	summary: string;
	public: boolean;
	created: number;
	count?:number;
};
export type BookmarkCollectionDetailSchema={
	id:number;
}
export type BookmarkCollectionItemType={
	id:number;
	group?:BookmarkCollectionType;
	post:PostItemType
}
export const BookmarkPostCollectionSchema=z.object({
	id:z.number().optional(),
	title:z.string(),
	summary:z.string().nullable().optional(),
	public:z.boolean().default(true),
});
export const BookmarkItemSchema=z.object({
	cid:z.number(),
	id:z.number(),
});

