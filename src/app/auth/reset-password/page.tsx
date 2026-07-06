"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const ResetPasswordSchema = z.object({
	password: z.string().min(6),
});

type SignInForm = z.infer<typeof ResetPasswordSchema>;
interface Prop {
	openSignInTab: () => void;
}

export default function ResetPasswordPage() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const error = searchParams.get("error");
	const router = useRouter()
	const form = useForm<SignInForm>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: "",
		}
	});

	const { isSubmitting } = form.formState;
	
	async function handleResetPassword(data: SignInForm) {
		if (token ==null) return;
		
		await authClient.resetPassword({
			newPassword: data.password,
			token,
		}, {
			onError: error => {
				toast.error(error.error.message || "Failed to reset password")
			},
			onSuccess: () => {
				toast.success("Password reset successfull", {
					description: "Redirection to login...",
				})
				setTimeout(() => {
					router.push("/auth/login");
				}, 1000);
			},
		}
	);
	}

	if (token  == null && error == null) {
		return (
			<div className="flex h-screen items-center justify-center my-6 px-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Invalid Reset Link</CardTitle>
						<CardDescription>The password reset link is invalid or has expired</CardDescription>
					</CardHeader>
					<CardContent>
						<Button className="w-full" asChild>
							<Link className="text-blue-500" href="/auth/login">Back to login</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex h-screen items-center justify-center my-6 px-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Reset Your Password</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form className="space-y-4" onSubmit={form.handleSubmit(handleResetPassword)}>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<PasswordInput {...field}/>
										</FormControl>
										<FormMessage/>
									</FormItem>
								)}
							/>
							<Button type="submit" className="flex-1">
								<LoadingSwap isLoading={isSubmitting}>
									Reset Password
								</LoadingSwap>
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}