"use client"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";

const links = [
	{
		label: "Dashboard",
		href: "#",
		icon: <IconBrandTabler className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
	},
	{
		label: "Profile",
		href: "#",
		icon: <IconUserBolt className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
	},
	{
		label: "Settings",
		href: "#",
		icon: <IconSettings className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
	},
	{
		label: "Logout",
		href: "#",
		icon: <IconArrowLeft className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
	},
];

export default function DiscussionLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div className="mx-auto flex h-screen w-screen flex-col overflow-hidden rounded-md border border-neutral-200 md:flex-row dark:border-neutral-700">
			<Sidebar open={open} setOpen={setOpen}>
				<SidebarBody className="justify-between gap-10">
					<div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
						<Link href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal">
							<Image src="/shiroko_logo.jpg" width={20} height={20} alt="Logo" className="rounded-full" />
							<motion.span
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="whitespace-pre font-medium"
							>
								Shiroko Discussion
							</motion.span>
						</Link>
						<div className="mt-8 flex flex-col gap-2">
							{links.map((link, index) => (
								<SidebarLink key={index} link={link} />
							))}
						</div>
					</div>
					<div>
						<SidebarLink
							link={{
								label: "Shiroko Discussion",
								href: "#",
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
		</div>
	);
}
