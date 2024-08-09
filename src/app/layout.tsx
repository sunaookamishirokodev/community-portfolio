import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/themes.css";

const { NEXT_PUBLIC_FACEBOOK_URL, NEXT_PUBLIC_BASE_URL } = process.env;

export const metadata: Metadata = {
	metadataBase: new URL(NEXT_PUBLIC_BASE_URL),
	title: "Shiroko's Profile",
	description:
		"Hello everyone, I'm Shiroko - a normal student who likes to code, watch anime, play games and communicate with people. So you can hire me to code your website, portfolio, economy, advertising website but not 18+ or illegal. Furthermore, I am the administrator of Elaina Team - a new technology team in Vietnam and I am really happy if I can be of any help to you. Thanks for reading, have a great day!",
	applicationName: "Personal Portfolio",
	authors: {
		url: NEXT_PUBLIC_FACEBOOK_URL,
		name: "Sunaookami Shiroko (Shiroko)",
	},
	generator: "NextJS TailwinCSS TypeScript",
	keywords: [
		"Portfolio",
		"Profile",
		"Shiroko",
		"2007",
		"Programmer",
		"Coder",
		"Developer",
		"ElainaTeam",
		"Fullstack",
		"Bot",
	],
	referrer: "origin-when-cross-origin",
	// verification: {
	// 	google: String(process.env.GOOGLE_KEY),
	// 	other: {
	// 		"dmca-site-verification": String(process.env.DMCA_KEY),
	// 	},
	// },
	publisher: "Sunaookami Shiroko",
	creator: "Sunaookami Shiroko",
	formatDetection: {
		address: false,
		telephone: false,
	},
	openGraph: {
		title: "Shiroko's Profile",
		description: "Hey guys! Welcome to my website:3",
		url: NEXT_PUBLIC_BASE_URL,
		siteName: "me.shirokodev.site",
		locale: "vi_VN",
		countryName: "Vietnam",
		images: [
			{
				url: "/shiroko_seo.jpg",
				alt: "Shiroko Background SEO",
			},
		],
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			{children}
		</html>
	);
}
