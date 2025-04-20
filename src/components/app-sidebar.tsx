import {
  IconChartBar,
  IconReceiptBitcoin,
  IconFolder,
  IconHelp,
  IconCoinBitcoin,
  IconCurrencyBitcoin,
  IconSearch,
  IconSettings,
  IconUsers,
  IconChartPie,
  IconFileAnalytics,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Finance",
      url: "#",
      icon: IconCurrencyBitcoin,
      items: [
        {
          title: "Transactions",
          url: "#",
          icon: IconReceiptBitcoin,
          path: "/finance/transactions",
        },
        {
          title: "Budgets",
          url: "#",
          icon: IconChartPie,
          path: "/finance/budgets",
        },
        {
          title: "Reports",
          url: "#",
          icon: IconFileAnalytics,
          path: "/finance/reports",
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
      path: "/analytics",
    },
    {
      title: "Projects",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mb-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconCoinBitcoin className="!size-5" />
                <span className="text-xl font-bold">Spendy</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
