"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useRouter } from "next/navigation";
import type { Passkey } from "@better-auth/passkey";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-btn";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useState } from "react";


const passKeySchema = z.object({
	name: z.string().min(1),
});

type PassKeyForm = z.infer<typeof passKeySchema>;

export function PassKeyManagement({ passkeys }: { passkeys: Passkey[] }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const router = useRouter();
	const form = useForm<PassKeyForm>({
		resolver: zodResolver(passKeySchema),
		defaultValues: {
			name: "",
		}
	});

	const { isSubmitting } = form.formState;
	
	async function handleAddPassKey(data: PassKeyForm) {
		await authClient.passkey.addPasskey(data, {
			onError: error => {
				toast.error(error.error.message || "Failed to add passkey");
			},
			onSuccess: () => {
				router.refresh();
				setIsDialogOpen(false)
			}
		})
	}

	async function handleDeletePassKey(passkeyId: string) {
		return authClient.passkey.deletePasskey(
			{ id: passkeyId },
			{ onSuccess: () => router.refresh() }
		);
	}

	return (
		<div className="space-y-6">
			{passkeys.length === 0 ? (
				<Card>
					<CardHeader>
						<CardTitle>No passkeys yet</CardTitle>
						<CardDescription>
							Add your first passkey for secure, passwordless authentication.
						</CardDescription>
					</CardHeader>
				</Card>
			) : (
				<div className="space-y-4">
					{passkeys.map(passkey => (
						<Card key={passkey.id}>
							<CardHeader className="flex gap-2 items-center justify-between">
								<div className="space-y-1">
									<CardTitle></CardTitle>
									<CardDescription>
										Created { new Date(passkey.createdAt).toLocaleDateString() }
									</CardDescription>
								</div>
								<BetterAuthActionButton
									requireAreYouSure
									variant="destructive"
									size="icon"
									action={() => handleDeletePassKey(passkey.id)}
								>
									<Trash2/>
								</BetterAuthActionButton>
							</CardHeader>
						</Card>
					))}
				</div>
			)}

			<Dialog open={isDialogOpen} onOpenChange={(o) => {
				if (o) form.reset();
				setIsDialogOpen(o)
			}}>
				<DialogTrigger asChild>
					<Button>New PassKey</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New PassKey</DialogTitle>
						<DialogDescription>
							Create a new passkey for secure, passwordless authentification
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form className="space-y-4" onSubmit={form.handleSubmit(handleAddPassKey)}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input type="text" {...field}/>
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								<LoadingSwap isLoading={isSubmitting}>
									Verify
								</LoadingSwap>
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	)
}