import { __ } from "@/lib/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { toast } from "sonner";
import { z } from "zod";
import useApiMutation from "./use-api-mutation";
import useDownload from "./use-download";
import { PluginInstallResponse, PluginInstallSchema } from "./use-install";
import useInstalled from "./use-is-installed";
import useTaskQueue from "./use-task-queue";
import { EnumItemType } from "@/zod/item";
type BulkProviderProps = {
	children: React.ReactNode;
	storageKey?: string;
};
const itemSchema = z.object({
	id: z.coerce.number(),
	title: z.string(),
	version: z.string(),
	type: EnumItemType,
	image: z.string().optional(),
});
type BulkItemType = z.infer<typeof itemSchema>;
const itemsSchema = z.array(itemSchema);
type BulkProviderState = {
	items: z.infer<typeof itemSchema>[];
	install: () => void;
	download: () => void;
	addItem: (item: BulkItemType) => void;
	removeItem: (item_id: number | string) => void;
	clearItems: () => void;
	hasItem: (item_id: number | string) => boolean;
};
const BulkProviderContext = createContext<BulkProviderState>({
	items: [],
	install: () => {},
	download: () => {},
	addItem: () => {},
	removeItem: () => {},
	clearItems: () => {},
	hasItem: () => {
		return false;
	},
});
export function BulkProvider({
	children,
	storageKey = "bulk_cart",
	...props
}: BulkProviderProps) {
	const { addDownloadTask } = useDownload();
	const [items, setItems] = useState<BulkItemType[]>(() => {
		try {
			const initialState = itemsSchema.safeParse(
				JSON.parse(localStorage.getItem(storageKey) ?? ""),
			);
			if (initialState.success) {
				return initialState.data;
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			return [];
		}
		return [];
	});
	const { addTask: addQueueTask } = useTaskQueue();
	const { clearCache, list } = useInstalled();
	const { mutateAsync: installAsync } = useApiMutation<
		PluginInstallResponse,
		PluginInstallSchema
	>("item/install");
	useEffect(() => {
		const parsed = itemsSchema.safeParse(items);
		if (parsed.success) {
			localStorage.setItem(storageKey, JSON.stringify(parsed.data));
		}
	}, [items, storageKey]);
	const addItem = (item: BulkItemType) => {
		toast.success(__("Added To Cart"), {
			description: decodeEntities(item.title),
		});
		setItems(prev => [...prev.filter(i => i.id != item.id), item]);
	};
	const removeItem = (item_id: number | string) => {
		const item = items.find(i => i.id === Number(item_id));
		if (item) {
			toast.info(__("Removed From Cart"), {
				description: decodeEntities(item.title),
			});
			setItems(prev => prev?.filter(i => i.id != item.id));
		}
	};
	const hasItem = useCallback(
		(item_id: number | string) => {
			return items?.filter(i => i.id === Number(item_id)).length > 0;
		},
		[items],
	);
	const clearItems = () => {
		toast.info(__("Cart Cleared"));
		setItems(() => []);
	};
	const download = () => {
		items.forEach(item => {
			addQueueTask(() => {
				return new Promise((resolve, reject) => {
					toast.promise(
						installAsync({
							item_id: item.id,
							method: "download",
						}),
						{
							description: item.title,
							loading: __("Fetching Download Link"),
							success(data) {
								resolve(data);
								removeItem(item.id);
								if (data.link && data.filename) {
									addDownloadTask(data.link, data.filename);
									return __("Added to queue");
								}
								return __("Something went wrong");
							},
							error(err) {
								reject(err);
								return err.message ?? __("Error");
							},
							finally() {
								clearCache();
							},
						},
					);
				});
			});
		});
	};
	const install = () => {
		items.forEach(item => {
			addQueueTask(() => {
				return new Promise((resolve, reject) => {
					const isInstalled = list?.find(i => Number(i.id) === Number(item.id));
					toast.promise(
						installAsync({
							item_id: item.id,
							method: isInstalled ? "update" : "install",
						}),
						{
							description: item.title,
							loading: isInstalled ? __("Updating") : __("Installing"),
							success(data) {
								resolve(data);
								removeItem(item.id);
								return __("Success");
							},
							error(err) {
								reject(err);
								return err.message ?? __("Error");
							},
							finally() {
								clearCache();
							},
						},
					);
				});
			});
		});
	};
	const value = {
		items,
		install,
		download,
		addItem,
		removeItem,
		clearItems,
		hasItem,
	};
	return (
		<BulkProviderContext.Provider {...props} value={value}>
			{children}
		</BulkProviderContext.Provider>
	);
}
export default function useBulk() {
	const context = useContext(BulkProviderContext);
	if (context === undefined) {
		throw new Error("useBulk must be used within a BulkProvider");
	}
	return context;
}
