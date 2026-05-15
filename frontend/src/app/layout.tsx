import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Fintrack",
	description: "A dashboard to track finance",
};

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
			<body className={inter.className}>
				<TooltipProvider>
					<NextTopLoader showSpinner={false} color="#7008e7" />
					{children}
				</TooltipProvider>
				<Toaster richColors closeButton />
			</body>
		</html>
	);
}
