"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

const ProfileUpdateSchema = z.object({
	currentPassword: z.string().min(6),
	newPassword: z.string().min(6),
	revokeOtherSessions: z.boolean()
});

type ChangePasswordForm = z.infer<typeof ProfileUpdateSchema>;

export function ChangePasswordForm() {
	const form = useForm<ChangePasswordForm>({
		resolver: zodResolver(ProfileUpdateSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			revokeOtherSessions: true
		}
	});

	const { isSubmitting } = form.formState;
	
	async function handlePasswordChange(data: ChangePasswordForm) {
		await authClient.changePassword(data, {
			onError: error => {
				toast.error(error.error.message || "Failed to change password");
			},
			onSuccess: () => {
				toast.success("Password changed successfully");
				form.reset();
			}
		});
	}

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(handlePasswordChange)}>
				<FormField
					control={form.control}
					name="currentPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current Password</FormLabel>
							<FormControl>
								<PasswordInput {...field}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="newPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<PasswordInput {...field}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="revokeOtherSessions"
					render={({ field }) => (
						<FormItem className="flex">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel>Log out other session</FormLabel>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					<LoadingSwap isLoading={isSubmitting}>
						Change Password
					</LoadingSwap>
				</Button>
			</form>
		</Form>
	);
}