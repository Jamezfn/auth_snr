import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { Session } from "better-auth";
import { Monitor, Smartphone, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js";

export function SessionCard({ session, isCurrentSession = false }: { session: Session, isCurrentSession?: boolean }) {
	const router = useRouter();
	const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;
	
	function getBrowserInformation() {
		if (userAgentInfo == null) return "Unknown Device";
		if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
			return "Unknown Device";
		}
		if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
		if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

		return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
	}

	function formDate(date: Date) {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: "medium",
			timeStyle: "short"
		}).format(new Date(date));
	}

	function revokeSession() {
		return authClient.revokeSession({
			token: session.token
		}, {
			onSuccess: () => {
				router.refresh();
			}
		});
	}

	return (
		<Card>
			<CardHeader className="flex justify-between">
				<CardTitle>{getBrowserInformation()}</CardTitle>
				{isCurrentSession && <Badge>Current Session</Badge>}
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						{userAgentInfo?.device.type === "mobile" ? (
							<Smartphone/>
						) : (
							<Monitor/>
						)}
						<div>
							<p className="text-sm text-muted-foreground">
								Created: { formDate(session.createdAt) }
							</p>
							<p className="text-sm text-muted-foreground">
								Expires: { formDate(session.expiresAt) }
							</p>
						</div>
					</div>
					{!isCurrentSession && (
						<BetterAuthActionButton
							variant="destructive"
							size="sm"
							action={revokeSession}
							successMessage="Session revoked"
						>
							<Trash/>
						</BetterAuthActionButton>
					)}
				</div>
			</CardContent>
		</Card>
	);
}