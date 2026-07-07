import { SUPPORTED_OAUTH_PROVIDER_DETAILS, SupportedOAuthProvider } from "@/lib/auth/o-auth-providers";
import { Account } from "./account-linking";
import { Plus, Shield, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export function AccountCard({ provider, account }: { provider: string, account?: Account }) {
	const router = useRouter();
	const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider as SupportedOAuthProvider] ?? { name: provider, Icon: Shield }; 

	function linkAccount() {
		return authClient.linkSocial({
			provider,
			callbackURL: "/profile"
		})
	}
	
	function unlinkAccount() {
		if (account == null) {
			return Promise.resolve({ error: { message: "Account not found" } });
		}

		return authClient.unlinkAccount({
			accountId: account.accountId,
			providerId: provider
		}, {
			onSuccess: () => {
				router.refresh();
			}
		});
	}

	return (
		<Card>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						{<providerDetails.Icon className="size-5"/>}
						<div>
							<p className="font-medium">{providerDetails.name}</p>
							{account == null ? (
								<p className="text-sm text-muted-foreground">
									Connect your {providerDetails.name} account for easier sign-in
								</p>
							) : (
								<p className="text-sm text-muted-foreground">
									Linked on {new Date(account.createdAt).toLocaleDateString()}
								</p>
							)}
						</div>
					</div>
					{account == null ? (
						<BetterAuthActionButton
							variant="outline"
							size="sm"
							action={linkAccount}
						>
							<Plus/>
							Link
						</BetterAuthActionButton>
					) : (
						<BetterAuthActionButton
							variant="destructive"
							size="sm"
							action={unlinkAccount}
						>
							<Trash2/>
							Unlink
						</BetterAuthActionButton>
					)}
				</div>
			</CardContent>
		</Card>
	);
}