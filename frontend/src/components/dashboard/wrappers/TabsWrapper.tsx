import { UrlFetchProps } from "@/app/page";
import Tabs from "@/components/dashboard/Tabs";
import { Suspense } from "react";

async function TabsContent(props: UrlFetchProps) {
	return <Tabs {...props} />;
}

export default function TabsWrapper(props: UrlFetchProps) {
	return (
		<Suspense
			fallback={<div className="bubble bg-muted h-6 animate-pulse lg:hidden" />}
		>
			<TabsContent {...props} />
		</Suspense>
	);
}
