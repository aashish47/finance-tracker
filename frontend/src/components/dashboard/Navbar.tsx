"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UrlProps, UserMetadata } from "@/types/types";
import { buildUrl } from "@/utils/buildUrl";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavbarProps {
	userData?: UserMetadata;
	data: number[];
}

const Navbar = ({
	userData,
	data,
	selectedYear,
	selectedCategory,
	selectedMonth,
	selectedDate,
	selectedTab,
}: NavbarProps & UrlProps) => {
	const router = useRouter();
	// console.log(`Navbar rendered at: ${new Date().toLocaleTimeString()}`);
	return (
		userData && (
			<nav className="bubble flex h-12 items-center justify-between">
				{/* <p className="w-1/3">LOGO</p> */}

				<Select
					onValueChange={(value) => {
						selectedYear = Number(value);
						const url = buildUrl({
							selectedYear,
							selectedMonth,
							selectedCategory,
							selectedTab,
							selectedDate,
						});
						router.push(url);
					}}
					value={selectedYear.toString()}
				>
					<SelectTrigger className="w-24">
						<SelectValue placeholder="Select Year" />
					</SelectTrigger>
					<SelectContent>
						{data &&
							data.map((year: number) => (
								<SelectItem key={year} value={year.toString()}>
									{year}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
				<p className="text-center md:text-xl md:font-semibold">Dashboard</p>
				<div className="flex items-center justify-end gap-2 md:gap-4 md:text-lg">
					<p className="hidden capitalize md:block">{userData.name}</p>

					{userData.picture && (
						<Image
							className="rounded-full"
							src={userData.picture}
							alt="profile picture"
							width={32}
							height={32}
						/>
					)}
				</div>
			</nav>
		)
	);
};

export default Navbar;
