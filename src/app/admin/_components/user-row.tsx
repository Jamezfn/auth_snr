"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth/auth-client";
import { UserWithRole } from "better-auth/plugins";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserRow({ user, selfId }: { user: UserWithRole, selfId: string }) {
	const { refetch } = authClient.useSession()
	const router = useRouter();
	const isSelf = user.id === selfId;

	async function handImpersonateUser(userId: string) {
		await authClient.admin.impersonateUser({ userId }, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to impersonate user")
			},
			onSuccess: () => {
				refetch()
				router.push("/")
			}
		})
	}

	async function handRevokeSession(userId: string) {
		await authClient.admin.revokeUserSessions({ userId }, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to revoke")
			},
			onSuccess: () => {
				toast.success("User sessions revoked");
			}
		})
	}

	async function handUnburnUser(userId: string) {
		await authClient.admin.unbanUser({ userId }, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to unban user")
			},
			onSuccess: () => {
				toast.success("User is banned");
				router.refresh();
			}
		})
	}

	async function handBurnUser(userId: string) {
		await authClient.admin.banUser({ userId }, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to ban user")
			},
			onSuccess: () => {
				toast.success("User is banned");
				router.refresh();
			}
		})
	}

	async function handleRemoveUser(userId: string) {
		await authClient.admin.removeUser({ userId }, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to delete user")
			},
			onSuccess: () => {
				toast.success("User deleted");
				router.refresh();
			}
		})
	}

	return (
		<TableRow key={user.id}>
			<TableCell>
				<div>
					<div className="font-medium">{user.name || "No name"}</div>
					<div className="text-sm text-muted-foreground">{user.email}</div>
					<div className="flex items-center gap-2 not-empty:mt-2">
						{user.banned && <Badge variant="destructive">Banned</Badge>}
						{!user.emailVerified && <Badge variant="outline">Unverified</Badge>}
						{isSelf && <Badge>You</Badge>}
					</div>
				</div>
			</TableCell>
			<TableCell>
				<Badge variant={user.role === "admin" ? "default" : "secondary"}>
					{user.role}
				</Badge>
			</TableCell>
			<TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
			<TableCell>
				{!isSelf && (
					<AlertDialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<MoreHorizontal/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={() => handImpersonateUser(user.id)}>
									Impersonate
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handRevokeSession(user.id)}>
									Revoke
								</DropdownMenuItem>
								{user.banned ? (
									<DropdownMenuItem onClick={() => handUnburnUser(user.id)}>
										Unburn User
									</DropdownMenuItem>
								) : (
									<DropdownMenuItem onClick={() => handBurnUser(user.id)}>
										Burn User
									</DropdownMenuItem>
								)}
								<DropdownMenuSeparator/>
								<AlertDialogTrigger asChild>
									<DropdownMenuItem variant="destructive">
										Delete User
									</DropdownMenuItem>
								</AlertDialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<AlertDialogContent>
							<AlertDialogHeader>
								 <AlertDialogTitle>Delete user</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete this user? This action cannot
									be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									variant="destructive"
									onClick={() => handleRemoveUser(user.id)}
									className="hover:bg-destructive/90"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}
			</TableCell>
		</TableRow>
	);
}