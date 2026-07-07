import { LoaderIcon } from "lucide-react";
import { ReactNode, Suspense } from "react";

export function LoadingSuspense({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<LoaderIcon className="size-20 animate-spin"/>}>
			{ children }
		</Suspense>
	);
}