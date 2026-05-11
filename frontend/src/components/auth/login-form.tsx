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
import { login, oauth } from "@/lib/actions/auth-actions";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const googleOuth = oauth.bind(null, "google");
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<FormContent>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="m@example.com"
										required
									/>
								</Field>
								<Field>
									<div className="flex items-center">
										<FieldLabel htmlFor="password">Password</FieldLabel>
										<Link
											href="#"
											className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
										>
											Forgot your password?
										</Link>
									</div>
									<Input
										id="password"
										name="password"
										type="password"
										required
									/>
								</Field>
								<Field>
									<FormButton formAction={login} formType="login" />
									<FormButton
										formNoValidate
										variant="outline"
										formAction={googleOuth}
										formType="login"
										oAuth="google"
									/>
									<FieldDescription className="text-center">
										Don&apos;t have an account?{" "}
										<Link href="/signup">Sign up</Link>
									</FieldDescription>
								</Field>
							</FieldGroup>
						</FormContent>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
