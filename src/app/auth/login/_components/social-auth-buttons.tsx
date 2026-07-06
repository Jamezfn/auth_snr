"use client";

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { authClient } from "@/lib/auth/auth-client";
import { SUPPORTED_OAUTH_PROVIDER_DETAILS, SUPPORTED_OAUTH_PROVIDERS } from "@/lib/auth/o-auth-providers";

export default function SocialAuthButtons() {
	return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
		const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;
		// TODO: Handle loading and error states

		return (
			<BetterAuthActionButton 
				key={provider}
				variant="outline"
				action={() => authClient.signIn.social({provider, callbackURL: "/"})}
			>
				<Icon/>
				{SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
			</BetterAuthActionButton>
		);
	})
}
