import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type ButtonProps, buttonVariants } from "@/components/ui/button";
import { type IconProps } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavItem, sidebarConfig } from "@/config/sidebar";
import { cn, isLinkActive } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { ChevronDown, ExternalLinkIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type LinkStyleProps = {
  active?: boolean;
  disabled?: boolean;
  className?: string;
} & VariantProps<typeof buttonVariants>;

function linkStyle({ active, disabled, className, ...props }: LinkStyleProps) {
  return cn(
    buttonVariants({
      variant: active ? "secondary" : "ghost",
      size: props.size,
      ...props,
    }),
    "flex h-8 w-full items-center justify-start gap-3 px-3",
    disabled && "pointer-events-none opacity-50",
    className,
  );
}

type SidebarNavProps = {
  sidebarNavIncludeIds?: string[];
  sidebarNavRemoveIds?: string[];
};

export function SidebarNav({
  sidebarNavIncludeIds,
  sidebarNavRemoveIds,
}: SidebarNavProps) {
  const isCollapsed = false;

  const { pathname } = useLocation();

  const sidebarNavitems = sidebarConfig.filteredNavItems({
    removeIds: sidebarNavRemoveIds,
    includedIds: sidebarNavIncludeIds,
  });

  return (
    <TooltipProvider disableHoverableContent delayDuration={0}>
      <nav>
        {sidebarNavitems.map((nav, index) => (
          <div key={nav.id}>
            {nav.showLabel && (
              <h3 className="mb-2 px-2 pt-3 text-xs font-semibold uppercase text-muted-foreground">
                {nav.label}
              </h3>
            )}
            <ul className="flex flex-col gap-1">
              {nav.items.map(item => (
                <li key={item.label}>
                  {/**
                   * if the item has a subMenu, we will render an accordion component to handle the subMenu
                   * otherwise, we will render a simple link
                   */}
                  {item.subMenu ? (
                    <Accordion
                      type="single"
                      collapsible
                      defaultValue={
                        item.subMenu.find(
                          (subItem: {
                            label: string;
                            href: string;
                            icon: React.ComponentType<IconProps>;
                          }) => isLinkActive(pathname, subItem.href),
                        )
                          ? item.label
                          : undefined
                      }
                    >
                      <AccordionItem value={item.label}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AccordionTrigger
                              className={linkStyle({
                                className: "justify-between",
                              })}
                            >
                              <div className="flex items-center justify-start gap-3 ">
                                <item.icon
                                  className={cn(
                                    "flex-shrink-0",
                                    isCollapsed ? "h-5 w-5" : "h-4 w-4 ",
                                  )}
                                />
                                {!isCollapsed && (
                                  <span className="truncate">{item.label}</span>
                                )}
                              </div>
                            </AccordionTrigger>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent
                              side="right"
                              className="flex items-center gap-2 font-medium "
                            >
                              <span>{item.label}</span>
                              <ChevronDown className="h-4 w-4" />
                            </TooltipContent>
                          )}
                        </Tooltip>
                        <AccordionContent
                          className={cn(
                            " flex flex-col gap-1 pt-1",
                            isCollapsed ? "" : "relative pl-7 pr-0",
                          )}
                        >
                          {item.subMenu.map(subItem => (
                            <Tooltip key={subItem.label}>
                              <TooltipTrigger className="h-full w-full">
                                <NavLink
                                  {...subItem}
                                  active={isLinkActive(pathname, subItem.href)}
                                  isCollapsed={isCollapsed}
                                />
                              </TooltipTrigger>
                              {isCollapsed && (
                                <TooltipContent
                                  side="right"
                                  className="flex items-center gap-4 font-medium"
                                >
                                  {subItem.label}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          ))}

                          {!isCollapsed && (
                            <Separator
                              orientation="vertical"
                              className="absolute bottom-2 left-5 right-auto"
                            />
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger className="h-full w-full">
                        <NavLink
                          {...item}
                          active={isLinkActive(pathname, item.href)}
                          isCollapsed={isCollapsed}
                        />
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent
                          side="right"
                          className="flex items-center gap-4 font-medium"
                        >
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )}
                </li>
              ))}
            </ul>

            {index !== sidebarNavitems.length - 1 && (
              <Separator className="my-2" />
            )}
          </div>
        ))}
      </nav>
    </TooltipProvider>
  );
}

// Style the NavLink component to match the design system

type NavLinkProps = NavItem & {
  active?: boolean;
  isCollapsed?: boolean;
  size?: ButtonProps["size"];
};

function NavLink({
  href,
  as = "link",
  label,
  icon: Icon,
  disabled,
  active,
  size = "default",
  isCollapsed,
  external,
  notice: Notice,
}: NavLinkProps) {
  const isExternal = href?.startsWith("http") ?? external;
  const linkTarget = isExternal ? "_blank" : "_self";
  const content = (
    <>
      <Icon
        className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-4 w-4 ")}
      />
      {!isCollapsed && (
        <span className="flex-grow truncate text-left">{label}</span>
      )}
      {isExternal && (
        <span className="text-muted-foreground">
          <ExternalLinkIcon className="ml-2 h-3 w-3" />
        </span>
      )}
      {Notice && <Notice />}
    </>
  );
  if (as == "link") {
    return (
      <Link
        to={href??""}
        className={linkStyle({ active, disabled, size })}
        target={linkTarget}
        rel="noreferrer"
      >
        {content}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={linkStyle({ active, disabled, size })}
      target={linkTarget}
      rel="noreferrer"
    >
      {content}
    </a>
  );
}
