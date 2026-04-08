"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import {
	BellIcon,
	HomeIcon,
	LogOutIcon,
	SettingsIcon,
	StarIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
	const router = useRouter();
	return (
		<div className="flex h-12 w-screen items-center justify-around gap-8 border p-4 md:h-full md:w-12 md:flex-col md:rounded-r-3xl md:px-3 md:py-20">
			<Button variant={"ghost"} className="w-6 md:w-full">
				<HomeIcon />
			</Button>

			<Button variant={"ghost"} className="w-6 md:w-full">
				<StarIcon />
			</Button>
			<Button variant={"ghost"} className="w-6 md:w-full">
				<BellIcon />
			</Button>
			<Button variant={"ghost"} className="w-6 md:w-full">
				<SettingsIcon />
			</Button>

			<div className="hidden grow md:block"></div>
			<Button
				onClick={async () => {
					const supabase = createClient();
					await supabase.auth.signOut();
					router.push("/");
				}}
				variant={"ghost"}
				className="w-6 md:w-full"
			>
				<LogOutIcon />
			</Button>
		</div>
	);
};

export default Sidebar;
