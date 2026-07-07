"use client"

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { Card, CardContent } from "@/components/ui/card";
import { Session } from "better-auth";
import { AlertTriangle } from "lucide-react";
import { SessionCard } from "./session-card";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

interface Prop {
	session: Session[];
	currentSessionToken: string
}

export function SessionManagement({ session, currentSessionToken }: Prop) {
	const router = useRouter();

	const otherSessions = session.filter(s => s.token !== currentSessionToken);
	const CurrentSession = session.find(s => s.token === currentSessionToken);

	function revokeOtherSessions() {
		return authClient.revokeOtherSessions(undefined, {
			onSuccess: () => {
				router.refresh()
			}
		});
	}

	return (
		<div className="space-y-6">
			{CurrentSession && (
				<SessionCard session={CurrentSession} isCurrentSession />
			)}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-medium">Other Active Sessions</h3>
					{otherSessions.length > 0 && (
						<BetterAuthActionButton
							variant="destructive"
							size="sm"
							action={revokeOtherSessions}
						>
							Revoke Other Sessions
							<AlertTriangle/>
						</BetterAuthActionButton>
					)}
				</div>
				{otherSessions.length === 0 ? (
					<Card>
						<CardContent>
							No other active sessions
						</CardContent>
					</Card>
				) : (
					<div className="space-y-3">
						{otherSessions.map(session => (
							<SessionCard
								key={session.id}
								session={session}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}