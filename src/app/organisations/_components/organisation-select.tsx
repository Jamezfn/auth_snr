"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner";


export function OrganisationSelect() {
	const { data: activeOrganisation } = authClient.useActiveOrganization()
	const { data: organisations } = authClient.useListOrganizations();

	if (organisations === null || organisations.length  === 0) {
		return null;
	}

	function setActiveOrganisation(organizationId: string) {
		authClient.organization.setActive({ organizationId }, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to switch organisation");
			}
		})
	}

	return (
		<Select
			value={activeOrganisation?.id ?? ""}
			onValueChange={setActiveOrganisation}
		>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select an organisation" />
			</SelectTrigger>
			<SelectContent>
				{organisations.map(org => (
					<SelectItem key={org.id} value={org.id}>
						{org.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}