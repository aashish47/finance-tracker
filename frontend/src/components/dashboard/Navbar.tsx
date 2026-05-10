"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Query } from "@/graphql/generated/graphql";
import { buildUrl, UrlProps } from "@/utils/buildUrl";
import { UserMetadata } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";

interface NavbarProps {
	userData?: UserMetadata;
	years: Query["Years"];
}

const Navbar = (props: NavbarProps & UrlProps) => {
	const { userData, years, year, ...rest } = props;
	const router = useRouter();
	return (
		userData && (
			<nav className="bubble flex h-12 items-center justify-between">
				{/* <p className="w-1/3">LOGO</p> */}

				<Select
					onValueChange={(value) => {
						const url = buildUrl({
							year: Number(value),
							...rest,
						});
						router.push(url);
					}}
					value={year.toString()}
				>
					<SelectTrigger className="">
						<SelectValue placeholder="Select Year" />
					</SelectTrigger>
					<SelectContent position="popper" align="start">
						{years &&
							years.map(
								(year) =>
									year && (
										<SelectItem key={year} value={year.toString()}>
											{year}
										</SelectItem>
									),
							)}
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
