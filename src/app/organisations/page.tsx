import { auth } from "@/lib/auth/auth";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OrganisationSelect } from "./_components/organisation-select";
import { CreateOrganisation } from "./_components/organisation-button";
import { OrganisationTabs } from "./_components/organisation-tabs";

export default async function OrganisationsPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (session === null) return redirect("/auth/login");

	return (
		<div className="container mx-auto my-6 px-4">
			<Link href="/" className="inline-flex items-center mb-6">
				<ArrowLeft className="size-4"/>
				Back to Home
			</Link>
			<div className="flex items-center mb-8 gap-2">
				<OrganisationSelect/>
				<CreateOrganisation/>
			</div>
			<OrganisationTabs/>
		</div>
	);
}