import uuid from "@/lib/uuid";
import { createContext, useContext, useEffect, useState } from "react";
import useDownloader from "react-use-downloader";
import useTaskQueue from "./use-task-queue";
interface DownloadItem {
	uid: string;
	title?: string;
	image?: string;
	url: string;
	filename: string;
	percentage: number;
	status: "pending" | "queued" | "downloading" | "completed" | "error";
}
interface DownloadContextType {
	downloads: DownloadItem[];
	addDownloadTask: (url: string, filename: string) => void;
	clearCompleted: () => void;
}
const DownloadContext = createContext<DownloadContextType | undefined>(
	undefined,
);

type DownloadProviderProps = {
	children: React.ReactNode;
};
export function DownloadProvider({
	children,
	...props
}: DownloadProviderProps) {
	const { addTask } = useTaskQueue(1);
	const [downloads, setDownloads] = useState<DownloadItem[]>([]);
	const { download, percentage, isInProgress, cancel } = useDownloader();
	const addDownloadTask = (url: string, filename: string) => {
		setDownloads(prev => [
			...prev,
			{
				uid: uuid(),
				url,
				filename,
				status: "pending",
				percentage: 0,
			},
		]);
	};
	const clearCompleted = () => {
		setDownloads(prev => prev.filter(pre => pre.status !== "completed"));
	};
	const downloading =
		downloads.filter(d => d.status === "downloading").length > 0;
	const pending = downloads.find(d => d.status === "pending");
	useEffect(() => {
		if (!downloading && pending) {
			setDownloads(prev =>
				prev.map(d =>
					d.uid === pending.uid ? { ...d, status: "downloading" } : d,
				),
			);
			download(pending.url, pending.filename);
		}
	}, [downloading, pending, setDownloads, download]);

	useEffect(() => {
		setDownloads(prev =>
			prev.map(d =>
				d.status === "downloading"
					? {
							...d,
							status: isInProgress ? "downloading" : "completed",
							percentage,
						}
					: d,
			),
		);
	}, [isInProgress, percentage, setDownloads]);

	return (
		<DownloadContext.Provider
			value={{ addDownloadTask, downloads, clearCompleted }}
		>
			{children}
		</DownloadContext.Provider>
	);
}

export default function useDownload() {
	const context = useContext(DownloadContext);
	if (!context) {
		throw new Error("useDownloader must be used within a DownloadProvider");
	}
	return context;
}
