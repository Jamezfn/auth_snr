"use client"

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PassKeyButton() {
	const router = useRouter();
	const { refetch } = authClient.useSession();

	useEffect(() => {
		authClient.signIn.passkey(
			{ autoFill: true },
			{
				onSuccess: () => {
					// refetch();
					router.push("/");
				}
			}
		)
	}, [router]);

	return (
		<BetterAuthActionButton
			className="w-full"
			variant="outline"
			action={() => authClient.signIn.passkey(undefined, {
				onSuccess: () => {
					// refetch();
					router.push("/");
				}
			})}
		>
			Use PassKey
		</BetterAuthActionButton>
	)
}