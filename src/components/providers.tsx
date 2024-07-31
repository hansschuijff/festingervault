import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/useTheme";
import { Toaster } from "./ui/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
      <ThemeProvider defaultTheme="system" storageKey="vault-theme">
        {children}
        <Toaster richColors position="bottom-left" expand pauseWhenPageIsHidden={true} />
      <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
