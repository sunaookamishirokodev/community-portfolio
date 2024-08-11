"use client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import axios from "axios";
import { JetBrains_Mono } from "next/font/google";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

export const MenuState = createContext<{ isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> }>({
	isOpen: false,
	setIsOpen: () => false,
});

export const UserData = createContext<{
	user: HiddenPasswordUser | null;
	setUser: Dispatch<SetStateAction<HiddenPasswordUser | null>>;
}>({
	user: null,
	setUser: () => null,
});
const mainFont = JetBrains_Mono({ subsets: ["latin"] });

export default function RootTemplate({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [user, setUser] = useState<HiddenPasswordUser | null>(null);

	const { toast } = useToast();

	useEffect(() => {
		axios
			.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/@me`, { withCredentials: true })
			.then((res) => setUser(res.data.data))
			.catch((error) => {
				if (error.response?.status !== 401) {
					toast({
						title: "Something went wrong",
						description: error.response?.data?.msg,
						action: (
							<ToastAction onClick={() => location.reload()} altText="Reload">
								Reload
							</ToastAction>
						),
						variant: "destructive",
					});
				}
			});
	}, [toast]);

	return (
		<body className={mainFont.className} suppressHydrationWarning>
			<ThemeProvider attribute="data-theme" storageKey="theme" themes={["black", "light"]} defaultTheme="black">
				<UserData.Provider value={{ user, setUser }}>
					{children}
					<Toaster />
				</UserData.Provider>
			</ThemeProvider>
		</body>
	);
}
