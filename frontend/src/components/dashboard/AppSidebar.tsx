"use client";

import LogoutButton from "@/components/dashboard/LogoutButton";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { HomeIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AppSideBar = () => {
	const pathname = usePathname();
	const { toggleSidebar, open } = useSidebar();

	const navigationItems = [
		{
			label: "Dashboard",
			href: "/",
			icon: HomeIcon,
		},
	];

	return (
		<Sidebar>
			<SidebarHeader className="flex flex-row items-center justify-between">
				<h1 className="text-lg font-semibold">Finance Tracker</h1>
				<Button
					onClick={() => toggleSidebar()}
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					aria-label={open ? "Close sidebar" : "Open sidebar"}
				>
					{open ? (
						<XIcon className="h-4 w-4" />
					) : (
						<MenuIcon className="h-4 w-4" />
					)}
				</Button>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{navigationItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;

						return (
							<SidebarMenuItem key={item.href}>
								<SidebarMenuButton asChild isActive={isActive}>
									<Link href={item.href}>
										<Icon className="h-5 w-5" />
										<span>{item.label}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<LogoutButton />
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSideBar;
