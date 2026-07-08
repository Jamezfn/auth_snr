import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { useState } from "react";
import { TwoFactorData } from "./two-factor-auth";

const qrSchema = z.object({
  token: z.string().length(6),
});

type QrForm = z.infer<typeof qrSchema>

export default function QRCodeVerify({ totpURI, backupCodes, onDone }: TwoFactorData & { onDone: () => void }) {
	const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
	const router = useRouter();
	const form = useForm<QrForm>({
		resolver: zodResolver(qrSchema),
		defaultValues: {
			token: ""
		}
	});

	const { isSubmitting } = form.formState;
	
	async function HandleQrCode(data: QrForm) {
		await authClient.twoFactor.verifyTotp({
			code: data.token
		}, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to verify code");
			},
			onSuccess: () => {
				setSuccessfullyEnabled(true)
				router.refresh();
			}
		})
	}

	if (successfullyEnabled) {
		return (
			<>
				<p className="text-sm text-muted-foreground mb-2">Save these backup codes in safe place. You can use them to access your account.</p>
				<div className="grid grid-cols-2 gap-2 mb-4">
					{backupCodes.map((code, index) => (
						<div key={index} className="font-mono text-sm">{code}</div>
					))}
				</div>
				<Button variant="outline" onClick={onDone}>Done</Button>
			</>
		);
	}

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground">
				Scan this QR code with your authentication app and enter the code below:
			</p>
			<Form {...form}>
				<form className="space-y-4" onSubmit={form.handleSubmit(HandleQrCode)}>
					<FormField
						control={form.control}
						name="token"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Code</FormLabel>
								<FormControl>
									<Input {...field}/>
								</FormControl>
								<FormMessage/>
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="w-full"
					>
						<LoadingSwap isLoading={isSubmitting}>
							Submit Code
						</LoadingSwap>
					</Button>
				</form>
			</Form>
			<div className="p-4 bg-white rounded border mx-auto">
				<QRCode size={256} value={totpURI} />
			</div>
		</div>
	)
}
