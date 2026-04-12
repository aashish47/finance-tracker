import { cn } from "@/utils/conditional";
import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Fintrack",
	description: "A dashboard to track finance",
};

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn("font-sans", geist.variable, "dark")}
		>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
