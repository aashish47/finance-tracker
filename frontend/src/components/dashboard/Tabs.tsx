"use client";

import { buildUrl, UrlProps } from "@/utils/buildUrl";
import { useRouter } from "nextjs-toploader/app";

const Tabs = (props: UrlProps) => {
	const { tab, ...rest } = props;
	const router = useRouter();
	const handleClick = (tab: number) => {
		const url = buildUrl({
			tab,
			...rest,
		});
		router.push(url);
	};
	return (
		<div className="bubble flex h-6 items-center justify-around p-0! lg:hidden">
			<div
				onClick={() => handleClick(1)}
				className={`tabs rounded-l-lg lg:hidden ${tab === 1 ? "tab-active" : "tab-inactive"}`}
			>
				Home
			</div>
			<div
				onClick={() => handleClick(2)}
				className={`tabs md:hidden! ${tab === 2 ? "tab-active" : "tab-inactive"}`}
			>
				Transactions
			</div>
			<div
				onClick={() => handleClick(3)}
				className={`tabs rounded-r-lg lg:hidden ${tab === 3 ? "tab-active" : "tab-inactive"}`}
			>
				Day Data
			</div>
		</div>
	);
};

export default Tabs;
