"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { UserData } from "../template";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDefaultAvatarName, getUserMedia } from "@/functions/user";

export default function DiscussionPage() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<DiscussionMessage[]>([]);
	const [message, setMessage] = useState<string>("");
	const { user } = useContext(UserData);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const server = io(`${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/discussion`, { withCredentials: true });
		// removable
		server.emit("joinRoom", "clzmxugcf0000ac1y9w7m7vxo", console.log);
		setSocket(server);

		return () => {
			server.disconnect();
		};
	}, []);

	useEffect(() => {
		socket?.on("receiveMessage", (msg) => {
			console.log(msg);
			setMessages([...messages, msg]);
		});

		socket?.on("connect_error", (err) => console.log(err.message));
	}, [socket, messages]);

	return (
		<div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-3 dark:border-neutral-700 dark:bg-neutral-900">
			<ul className="flex flex-1 flex-col gap-2">
				{messages.map((msg, index) => {
					return (
						<li
							key={index}
							className={`flex gap-2 ${msg.member_id === user?.id ? "ml-auto flex-row-reverse" : "mr-auto"}`}
						>
							<Avatar>
								<AvatarImage src={getUserMedia(user?.avatar!)} alt={user?.display_name} />
								<AvatarFallback>{getDefaultAvatarName(user?.display_name!)}</AvatarFallback>
							</Avatar>
							<span
								className={`rounded-xl bg-primary px-3 py-1 ${msg.member_id === user?.id ? "rounded-tr-none" : "rounded-tl-none"}`}
							>
								{msg.content}
							</span>
						</li>
					);
				})}
			</ul>
			<div className="flex gap-3">
				<Input
					ref={inputRef}
					onChange={(e) => setMessage(e.target.value)}
					type="text"
					disabled={!user}
					placeholder={user ? "Type a message" : "Login to continue"}
				/>
				<Button
					variant="secondary"
					onClick={() => {
						if (!message) return;
						socket?.emit("sendMessage", message, "clzmxugcf0000ac1y9w7m7vxo", (data: DiscussionMessage) => {
							if (data) {
								if (!inputRef.current) return;
								setMessage("");
								inputRef.current.value = "";
								setMessages([...messages, data]);
							}
						});
					}}
					disabled={!message}
				>
					Send
				</Button>
			</div>
		</div>
	);
}
