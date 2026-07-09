"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const CreateOrganisationSchema = z.object({
	name: z.string().min(1),
});

type CreateOrganisationForm = z.infer<typeof CreateOrganisationSchema>;

export function CreateOrganisation() {
	const [open, setOpen] = useState(false)
	const router = useRouter();
	const form = useForm<CreateOrganisationForm>({
		resolver: zodResolver(CreateOrganisationSchema),
		defaultValues: {
			name: "",
		}
	});

	const { isSubmitting } = form.formState;
	
	async function handleCreateOrganisation(data: CreateOrganisationForm) {
		const slug = data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
		const res = await authClient.organization.create(
			{
				name: data.name,
				slug
			}
		);

		if (res.error) {
			toast.error(res.error.message || "Failed to create organization");
		} else {
			form.reset();
			setOpen(false);
			await authClient.organization.setActive({ organizationId: res.data.id });
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create Organisation</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Organisation</DialogTitle>
					<DialogDescription>Create a new otganisation to collaborate with your team.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(handleCreateOrganisation)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>name</FormLabel>
									<FormControl>
										<Input type="text" {...field}/>
									</FormControl>
									<FormMessage/>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button type="submit" className="">
								<LoadingSwap isLoading={isSubmitting}>
									create
								</LoadingSwap>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}