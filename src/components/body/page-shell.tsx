import { cn } from "@/lib/utils";
import { Fragment, type ElementType } from "react";
import ModeToggle from "../mode-toggle";
import { Skeleton } from "../ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
type BreadCrumbType = {
  label: string;
  href?: string;
};
type AppPageShellProps = {
  children: React.ReactNode;
  as?: ElementType;
  title: string;
  description?: string;
  isFetching?: boolean;
  isLoading?: boolean;
  preloader?: React.ReactNode;
  breadcrump?: BreadCrumbType[];
};

export function AppPageShell({
  children,
  as,
  title,
  description,
  isFetching = false,
  isLoading = false,
  preloader,
  breadcrump,
}: AppPageShellProps) {
  const Container = as ?? "main";
  if (!preloader) {
    preloader = (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }
  return (
    <div className={cn(["w-full space-y-8"])}>
      <PageHeader title={title} description={description} />
      {isLoading && preloader}
      <Container
        className={cn(["relative space-y-8 pb-8", isFetching && "blur-sm"])}
      >
        {breadcrump && (
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                {[
                  {
                    label: (
                      <span className="flex flex-row gap-2 items-center">
                        <Home size={16} /> Home
                      </span>
                    ),
                    href: "/",
                  },
                  ...breadcrump,
                ].map((item, index) => (
                  <Fragment key={index}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink asChild>
                          <Link to={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
        {children}
        {isFetching && (
          <div className="absolute left-0 top-0 h-full w-full cursor-progress"></div>
        )}
      </Container>
    </div>
  );
}

type PageHeaderProps = {
  title: string;
  description?: string;
};

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="flex flex-row items-start gap-4 border-b border-border py-6">
      <div className="flex flex-1 flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
        {description && (
          <p className="max-w-xl text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
