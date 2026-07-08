"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import QRCodeVerify from "./qr-code-verify";

const TwoFactorAuthSchema = z.object({
	password: z.string().min(1)
});

type TwoFactorAuthForm = z.infer<typeof TwoFactorAuthSchema>;
export type TwoFactorData = {
	totpURI: string;
	backupCodes: string[];
}

interface Prop {
	isEnabled: boolean;
}

export function TwoFactorAuth({ isEnabled }:Prop) {
	const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);
	const router = useRouter();
	const form = useForm<TwoFactorAuthForm>({
		resolver: zodResolver(TwoFactorAuthSchema),
		defaultValues: {
			password: ""
		}
	});

	const { isSubmitting } = form.formState;
	
	async function HandleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
		await authClient.twoFactor.disable({
			password: data.password
		}, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to disable 2FA")
			},
			onSuccess: () => {
				form.reset();
				router.refresh();
			}
		})
	}

	async function HandleEnableTwoFactorAuth(data: TwoFactorAuthForm) {
		const res = await authClient.twoFactor.enable({
			password: data.password,
		})

		if (res.error) {
			toast.error(res.error.message || "Failed to enable 2FA")
		}{
			setTwoFactorData(res.data);
			form.reset();
		}
	}

	if (twoFactorData !== null) {
		return <QRCodeVerify {...twoFactorData} onDone={() => {
			setTwoFactorData(null)
		}} />
	}

	return (
		<Form {...form}>
			<form className="space-y-4" onSubmit={form.handleSubmit(isEnabled ? HandleDisableTwoFactorAuth : HandleEnableTwoFactorAuth)}>
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
				<Button
					type="submit"
					className="w-full" 
					variant={isEnabled ? "destructive": "default"}
				>
					<LoadingSwap isLoading={isSubmitting}>
						{isEnabled ? "Disable 2FA" : "Enable 2FA"}
					</LoadingSwap>
				</Button>
			</form>
		</Form>
	)
}