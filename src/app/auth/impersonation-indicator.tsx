"use client"

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { authClient } from "@/lib/auth/auth-client";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";

export function ImpersonationIndicator() {
	const router = useRouter();
	const { data: session, refetch } = authClient.useSession();

	if (session?.session.impersonatedBy === null) return null;

	return (
		<div>
			<BetterAuthActionButton
				action={() => authClient.admin.stopImpersonating(undefined, {
					onSuccess: () => {
					router.push("/admin")
					refetch()
					}
				})}
				variant="destructive"
				size="sm"
			>
				<UserX className="size-4" />
			</BetterAuthActionButton>
		</div>
	);
}