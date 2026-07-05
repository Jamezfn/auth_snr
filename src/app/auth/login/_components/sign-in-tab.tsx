"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
	email: z.email().min(1),
	password: z.string().min(6)
});

type SignInForm = z.infer<typeof signInSchema>;

export function SignInTab() {
	const router = useRouter()
	const form = useForm<SignInForm>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		}
	});

	const { isSubmitting } = form.formState;
	
	async function handleSignIn(data: SignInForm) {
		authClient.signIn.email(
			{ ...data, callbackURL: "/" }, 
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to sign in")
				},
				onSuccess: () => {
					router.push("/")
				}
			}
		)

		await new Promise(resolve => setTimeout(resolve, 2000));
		console.log(data);
	}

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
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
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>password</FormLabel>
							<FormControl>
								<PasswordInput {...field}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					<LoadingSwap isLoading={isSubmitting}>
						Sign In
					</LoadingSwap>
				</Button>
			</form>
		</Form>
	)
}