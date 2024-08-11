"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { toast, useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaTerminal } from "react-icons/fa6";
// const links = [
// 	{
// 		label: "Dashboard",
// 		href: "#",
// 		icon: <IconBrandTabler className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
// 	},
// 	{
// 		label: "Profile",
// 		href: "#",
// 		icon: <IconUserBolt className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
// 	},
// 	{
// 		label: "Settings",
// 		href: "#",
// 		icon: <IconSettings className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
// 	},
// 	{
// 		label: "Logout",
// 		href: "#",
// 		icon: <IconArrowLeft className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
// 	},
// ];

export const MessagesContext = createContext<{
	messages: DiscussionMessage[];
	setMessages: Dispatch<SetStateAction<DiscussionMessage[]>>;
}>({
	messages: [],
	setMessages: () => [],
});

export default function DiscussionLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [open, setOpen] = useState<boolean>(false);
	const [messages, setMessages] = useState<DiscussionMessage[]>([]);
	const [channels, setChannels] = useState<DiscussionChannel[]>([]);
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		axios
			.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discussion/channel`, { withCredentials: true })
			.then((res) => setChannels(res.data.data))
			.catch((err) => setError(err.response.data.msg));
	}, []);

	useEffect(() => {
		toast({
			title: "Something went wrong",
			description: error,
			action: (
				<ToastAction onClick={() => location.reload()} altText="Reload">
					Reload
				</ToastAction>
			),
			variant: "destructive",
		});
	}, [error, toast]);

	return (
		<div className="mx-auto flex h-screen w-screen flex-col overflow-hidden rounded-md border border-neutral-200 md:flex-row dark:border-neutral-700">
			<MessagesContext.Provider value={{ messages, setMessages }}>
				<Sidebar open={open} setOpen={setOpen}>
					<SidebarBody className="justify-between gap-10">
						<div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
							<Link
								href="#"
								className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
							>
								<Image
									src="/shiroko_logo.jpg"
									width={20}
									height={20}
									alt="Logo"
									className="rounded-full"
								/>
								<motion.span
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="whitespace-pre font-medium"
								>
									Shiroko Discussion
								</motion.span>
							</Link>
							<ul className="mt-8 flex flex-col gap-2">
								{channels.map(({ id, name }, index) => {
									return (
										<li key={index} className="wiget">
											<Link
												href={`/discussion/${id}`}
												className="flex items-center gap-3"
												tabIndex={-1}
											>
												<FaTerminal /> <span>{name}</span>
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
						<div>
							<SidebarLink
								link={{
									label: "Shiroko Discussion",
									href: "javascript:void()",
									icon: (
										<Image
											src="/shiroko_logo.jpg"
											className="h-7 w-7 flex-shrink-0 rounded-full"
											width={50}
											height={50}
											alt="Avatar"
										/>
									),
								}}
							/>
						</div>
					</SidebarBody>
				</Sidebar>
				{children}
			</MessagesContext.Provider>
		</div>
	);
}
