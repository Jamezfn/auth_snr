import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth/auth-client";
import { CreateInviteButton } from "./create-invite-button";

export function InviteTab() {
	const { data: activeOrganisation } = authClient.useActiveOrganization();
	const pendingInvites = activeOrganisation?.invitations?.filter(
		invite => invite.status === "pending"
	)

	function cancelInvitation(invitationId: string) {
		return authClient.organization.cancelInvitation({ invitationId })
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<CreateInviteButton/>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{pendingInvites?.map(invite => (
						<TableRow key={invite.id}>
							<TableCell>{invite.email}</TableCell>
							<TableCell>
								{new Date(invite.expiresAt).toLocaleDateString()}
							</TableCell>
							<TableCell>
								<BetterAuthActionButton
									requireAreYouSure
									variant="destructive"
									size="sm"
									action={() => cancelInvitation(invite.id)}
								>
									Cancel
								</BetterAuthActionButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}