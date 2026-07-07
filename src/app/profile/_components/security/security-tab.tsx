import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { SetPasswordButton } from "../password/set-password-button";
import { ChangePasswordForm } from "../change-password/change-password-form";

export async function SecurityTab({ email }: { email: string }) {
	const accounts = await auth.api.listUserAccounts({ headers: await headers() });
	const hasPasswordAccount = accounts.some((a) => a.providerId === "credential");

	return (
		<div className="space-y-6">
			{ hasPasswordAccount ? (
				<Card>
					<CardHeader>
						<CardTitle>Change Password</CardTitle>
						<CardDescription>Update your password for improved security</CardDescription>
					</CardHeader>
					<CardContent>
						<ChangePasswordForm/>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Change Password</CardTitle>
						<CardDescription>We will send you a password reset email to set up a password.</CardDescription>
					</CardHeader>
					<CardContent>
						<SetPasswordButton email={email}/>
					</CardContent>
				</Card>
			)}
		</div>
	);
}