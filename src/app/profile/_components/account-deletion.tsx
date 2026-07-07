"use client"

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { authClient } from "@/lib/auth/auth-client";

export function AccountDeletion() {
	return (
		<BetterAuthActionButton
			requireAreYouSure
			variant="destructive"
			successMessage="Account deletion initiated. Please check your email to confirm."
			action={() => authClient.deleteUser({ callbackURL: "/" })}
		>
			Delete Account Permanently
		</BetterAuthActionButton>
	)
}