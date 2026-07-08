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

const TotpSchema = z.object({
	code: z.string().min(6),
});

type totpForm = z.infer<typeof TotpSchema>;

export function TotpForm() {
	const router = useRouter();
	const form = useForm<totpForm>({
		resolver: zodResolver(TotpSchema),
		defaultValues: {
			code: "",
		}
	});

	const { isSubmitting } = form.formState;
	
	async function handleTotpVerification(data: totpForm) {
		await authClient.twoFactor.verifyTotp(data, {
			onError: error => {
				toast.error(error.error.message || "Failed to verify code")
			},
			onSuccess: () => {
				router.push("/");
			}
		})
	}

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(handleTotpVerification)}>
				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Code</FormLabel>
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
	)
}