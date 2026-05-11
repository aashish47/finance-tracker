"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFormStatus } from "react-dom";

export type FormButtonName = "login" | "signup" | "add" | "create" | "save";

interface FormButtonProps extends ButtonProps {
	formType: FormButtonName;
	oAuth?: "google";
}

const pendingButtonName: Record<FormButtonName, string> = {
	add: "adding...",
	create: "creating...",
	save: "saving...",
	login: "logging in...",
	signup: "signing up...",
};

const FormButton = ({ formType, oAuth, ...props }: FormButtonProps) => {
	const { action, pending } = useFormStatus();
	const isThisButtonLoading = pending && action === props.formAction;

	return (
		<Button
			// className="w-full"
			disabled={pending}
			formAction={props.formAction}
			formNoValidate={props.formNoValidate}
			type="submit"
			variant={props.variant}
		>
			{isThisButtonLoading ? (
				<>
					<Spinner data-icon="inline-start" />
					<span className="capitalize">{pendingButtonName[formType]}</span>
				</>
			) : (
				<span className="capitalize">{`${formType} ${oAuth ? ` with ${oAuth}` : ""}`}</span>
			)}
		</Button>
	);
};

export default FormButton;
