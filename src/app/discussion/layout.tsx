import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Discussion",
	description: "A place where people discuss many issues with each other. ",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
