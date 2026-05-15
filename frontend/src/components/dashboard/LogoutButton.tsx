"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { logout } from "@/lib/actions/auth-actions";
import { format } from "date-fns";
import { LogOutIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function LogoutButton() {
	const [isPending, startTransition] = useTransition();

	const handleAction = () => {
		startTransition(async () => {
			const result = await logout();
			const toastType = result.success ? "success" : "error";
			toast[toastType](result.message, {
				description: format(result.date, "PPPPpp"),
			});
		});
	};
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					size={isPending ? "default" : "icon"}
					disabled={isPending}
				>
					<LogOutIcon />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
						<LogOutIcon />
					</AlertDialogMedia>
					<AlertDialogTitle>Logout ?</AlertDialogTitle>
					<AlertDialogDescription>
						You can always log back in at any time.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
					<form action={handleAction}>
						<AlertDialogAction
							className="w-full"
							type="submit"
							variant="destructive"
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Spinner data-icon="inline-start" />
									Logging out...
								</>
							) : (
								<>Logout</>
							)}
						</AlertDialogAction>
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
