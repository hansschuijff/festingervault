import { z } from "zod";
import { PostItemType } from "./item";
import { __ } from "@/lib/i18n";

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
	page?:number;
}
export type BookmarkCollectionItemType={
	id:number;
	group?:BookmarkCollectionType;
	post:PostItemType
}
export const BookmarkPostCollectionSchema=z.object({
	id:z.number().optional(),
	title:z.string().min(1,{
		message:__("Title cannot be empty")
	}).max(30,{
		message:__("Title cannot of more than 30 characters")
	}),
	summary:z.string().max(90,{
		message:__("Summary cannot of more than 90 characters")
	}).nullable().optional(),
	public:z.boolean().default(true),
});
export const BookmarkItemSchema=z.object({
	cid:z.number(),
	id:z.number(),
});

