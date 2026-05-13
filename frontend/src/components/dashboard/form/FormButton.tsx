"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFormStatus } from "react-dom";

export type FormButtonName =
	| "login"
	| "signup"
	| "add"
	| "create"
	| "save"
	| "update"
	| "delete";

interface FormButtonProps extends ButtonProps {
	formType: FormButtonName;
	oAuth?: "google";
	label?: string;
}

const pendingButtonName: Record<FormButtonName, string> = {
	add: "adding...",
	create: "creating...",
	save: "saving...",
	login: "logging in...",
	signup: "signing up...",
	update: "updating...",
	delete: "deleting...",
};

const FormButton = ({ formType, oAuth, label, ...props }: FormButtonProps) => {
	const { action, pending } = useFormStatus();
	// For Server Actions: check if this specific button is triggering
	// For client-side forms: just use pending state
	const isThisButtonLoading = props.formAction
		? pending && action === props.formAction
		: pending;

	const displayLabel = label || `${formType}${oAuth ? ` with ${oAuth}` : ""}`;

	return (
		<Button
			disabled={pending}
			formAction={props.formAction}
			formNoValidate={props.formNoValidate}
			type="submit"
			variant={props.variant}
			{...props}
		>
			{isThisButtonLoading ? (
				<>
					<Spinner data-icon="inline-start" />
					<span className="capitalize">{pendingButtonName[formType]}</span>
				</>
			) : (
				<span className="capitalize">{displayLabel}</span>
			)}
		</Button>
	);
};

export default FormButton;
