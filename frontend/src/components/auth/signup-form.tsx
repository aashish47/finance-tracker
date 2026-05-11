import FormButton from "@/components/dashboard/form/FormButton";
import FormContent from "@/components/dashboard/form/FormContent";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { oauth, signup } from "@/lib/actions/auth-actions";
import Link from "next/link";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	const googleOuth = oauth.bind(null, "google");
	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<FormContent>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name">Full Name</FieldLabel>
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="John Doe"
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="m@example.com"
									required
								/>
								<FieldDescription>
									We&apos;ll use this to contact you. We will not share your
									email with anyone else.
								</FieldDescription>
							</Field>
							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<Input id="password" name="password" type="password" required />
								<FieldDescription>
									Must be at least 8 characters long.
								</FieldDescription>
							</Field>
							<Field>
								<FieldLabel htmlFor="confirm-password">
									Confirm Password
								</FieldLabel>
								<Input
									id="confirm-password"
									name="confirm-password"
									type="password"
									required
								/>
								<FieldDescription>
									Please confirm your password.
								</FieldDescription>
							</Field>
							<FieldGroup>
								<Field>
									<FormButton formAction={signup} formType="signup" />
									<FormButton
										formNoValidate
										variant="outline"
										formAction={googleOuth}
										formType="signup"
										oAuth="google"
									/>
									<FieldDescription className="px-6 text-center">
										Already have an account? <Link href="/login">Sign in</Link>
									</FieldDescription>
								</Field>
							</FieldGroup>
						</FieldGroup>
					</FormContent>
				</form>
			</CardContent>
		</Card>
	);
}
