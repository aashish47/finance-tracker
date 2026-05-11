"use client";

import { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";

const FormContent = ({ children }: PropsWithChildren) => {
	const { pending } = useFormStatus();
	return (
		<fieldset disabled={pending} className="contents">
			{children}
		</fieldset>
	);
};

export default FormContent;
