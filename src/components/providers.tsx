import { BulkProvider } from "@/hooks/use-bulk";
import { DownloadProvider } from "@/hooks/use-download";
import { ThemeProvider } from "@/hooks/use-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./ui/sonner";

type ProvidersProps = {
	children: React.ReactNode;
};
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
		},
	},
});
export function Providers({ children }: ProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<DownloadProvider>
				<BulkProvider>
					<ThemeProvider defaultTheme="system" storageKey="vault-theme">
						{children}
						<Toaster
							richColors
							position="bottom-left"
							expand
							pauseWhenPageIsHidden={true}
						/>
						<ReactQueryDevtools initialIsOpen={false} />
					</ThemeProvider>
				</BulkProvider>
			</DownloadProvider>
		</QueryClientProvider>
	);
}
