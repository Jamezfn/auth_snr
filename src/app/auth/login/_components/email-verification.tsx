"use client"

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn"
import { authClient } from "@/lib/auth-client"
import { useEffect, useRef, useState } from "react"

interface Prop {
	email: string
}

export function EmailVerification({ email }: Prop){
	const interval = useRef<NodeJS.Timeout>(undefined);
	const [timeToNextResend, setTimeToNextResent] = useState(30);
	function startEmailVerificationCountDown(time = 30) {
		setTimeToNextResent(time);
		interval.current = setInterval(() => {
			setTimeToNextResent(t => {
				const newT = t - 1;

				if (newT <= 1) {
					clearInterval(interval.current)
					return 0;
				}

				return newT;
			})
		}, 1000);
	}

	useEffect(() => {
		// authClient.sendVerificationEmail({ email, callbackURL: "/" });
		startEmailVerificationCountDown();
	}, []);

	return (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground mt-2">
				We sent you a verification link. Please check your email and click the link to verify your account.
			</p>
			<BetterAuthActionButton 
				variant="outline"
				className="w-full"
				successMessage="Verification email sent!"
				disabled={timeToNextResend > 0}
				action={async () => {
					const result = await authClient.sendVerificationEmail({
						email,
						callbackURL: "/",
					});

					if (!result.error) {
						startEmailVerificationCountDown();
					}
					console.log(result);

					return result;
				}}
			>
				{ timeToNextResend > 0 ? `Resend Email (${timeToNextResend})` : "Resend Email" }
			</BetterAuthActionButton>
		</div>
	)
}