import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { SetPasswordButton } from "../password/set-password-button";
import { ChangePasswordForm } from "../change-password/change-password-form";
import { Badge } from "@/components/ui/badge";
import { TwoFactorAuth } from "./two-factor-auth";

export async function SecurityTab({ email, isTwoFactorEnabled }: { email: string, isTwoFactorEnabled: boolean }) {
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
			{hasPasswordAccount && (
				<Card>
					<CardHeader className="flex items-center justify-between gap-2">
						<CardTitle>Two-Factor Authentification</CardTitle>
						<Badge variant={isTwoFactorEnabled ? "default" : "secondary"}>{isTwoFactorEnabled ? "Enabled" : "Disabled"}</Badge>
					</CardHeader>
					<CardContent>
						<TwoFactorAuth isEnabled={isTwoFactorEnabled}/>
					</CardContent>
				</Card>
			)}
		</div>
	);
}