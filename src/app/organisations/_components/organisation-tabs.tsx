"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/auth-client";
import { MembersTab } from "./members-tab";
import { InviteTab } from "./invites-tab";
import { SubscriptionsTab } from "./subscriptions-tab";

export function OrganisationTabs() {
	const { data: activeOrganisation } = authClient.useActiveOrganization();
	return (
		<div>
			{activeOrganisation && 
				<Tabs defaultValue="members" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="members">Members</TabsTrigger>
						<TabsTrigger value="invitations">Invitations</TabsTrigger>
						<TabsTrigger value="subscription">Subscription</TabsTrigger>
					</TabsList>
					<Card>
						<CardContent>
							<TabsContent value="members">
								<MembersTab/>
							</TabsContent>
							<TabsContent value="invitations">
								<InviteTab/>
							</TabsContent>
							<TabsContent value="subscription">
								<SubscriptionsTab/>
							</TabsContent>
						</CardContent>
					</Card>
				</Tabs>
			}
		</div>
	);
}