"use client"

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export function InviteInformation({ invitation }: { invitation: { id: string, organizationId: string } }) {
	const router = useRouter()
	function acceptInvite() {
		return authClient.organization.acceptInvitation({
			invitationId: invitation.id
		}, {
			onSuccess: async () => {
				await authClient.organization.setActive({
					organizationId: invitation.organizationId
				})
				router.push("/organisations")
			}
		})
	}

	async function rejectInvite() {
		return await authClient.organization.rejectInvitation({
			invitationId: invitation.id
		}, {
			onSuccess: () => router.push("/")
		})
	}
	return (
		<div className="flex gap-4">
			<BetterAuthActionButton
				className="grow"
				action={acceptInvite}
			>
				Accept invitation
			</BetterAuthActionButton>
			<BetterAuthActionButton
				className="grow"
				variant="destructive"
				action={rejectInvite}
			>
				Reject
			</BetterAuthActionButton>
		</div>
	)
}