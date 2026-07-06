"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ForgotPasswordSchema = z.object({
	email: z.email().min(1),
});

type SignInForm = z.infer<typeof ForgotPasswordSchema>;
interface Prop {
	openSignInTab: () => void;
}

export function ForgotPassword({ openSignInTab }: Prop) {
	const router = useRouter()
	const form = useForm<SignInForm>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			email: "",
		}
	});

	const { isSubmitting } = form.formState;
	
	async function handleForgotPassword(data: SignInForm) {
		await authClient.requestPasswordReset({
			...data,
			redirectTo: "/auth/reset-password"
		}, {
			onError: error => {
				toast.error(error.error.message || "Failed to send password reset email")
			},
			onSuccess: () => {
				toast.success("Password reset email sent")
			},
		});
	}

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(handleForgotPassword)}>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" {...field}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<div className="flex gap-2">
					<Button 
						type="button" variant="outline"
						onClick={() => openSignInTab}
					>
						Back
					</Button>
					<Button type="submit" className="flex-1">
						<LoadingSwap isLoading={isSubmitting}>
							Send Reset Email
						</LoadingSwap>
					</Button>
				</div>
			</form>
		</Form>
	)
}