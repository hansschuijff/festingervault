import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Grid } from "@/components/ui/grid";
import { __ } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ClassNameValue } from "tailwind-merge";
type Props = {
	className?: ClassNameValue;
};
export default function DashboardWelcome({ className }: Props) {
	return (
		<Card className={cn("flex flex-col justify-between", className)}>
			<CardContent className="relative flex flex-1 flex-row items-center">
				<Grid size={40} />
				<div className="grid grid-cols-4">
					<div className="col-span-3 flex flex-col justify-center gap-4">
						<div className="flex -space-x-2">
							{Array.from({ length: 4 }).map((_, index) => (
								<div className="flex" key={index}>
									<Avatar className="relative size-10 shrink-0 rounded-full ring-1 ring-white/10 hover:z-10">
										<AvatarImage
											src={`https://i.pravatar.cc/50?u=${Math.random() * Date.now()}`}
										></AvatarImage>
										<AvatarFallback>FV</AvatarFallback>
									</Avatar>
								</div>
							))}
						</div>
						<h2 className="space-x-1 text-2xl font-semibold text-card-foreground">
							<span>{__("Unlimited WP themes, plugins and kits,")}</span>
							<span className="text-blue-500">{__("all in one place")}</span>
						</h2>
						<p className="text-sm font-medium leading-5 text-muted-foreground">
							{__(
								"Access an unrivaled range of quality themes, plugins and kits, with one simple subscription for a fraction of cost",
							)}
						</p>
					</div>
					<div className="grid-cols-1"></div>
				</div>
			</CardContent>
			<CardFooter className="text-cente justify-center border-t border-border">
				<a
					href="https://festingervault.com/beta-feedback"
					target="_blank"
					className="border-b border-dashed border-blue-500 text-sm text-blue-500"
				>
					{__("Get Started")}
				</a>
			</CardFooter>
		</Card>
	);
}
