"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function DiscussionPage() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<string[]>([]);
	const [message, setMessage] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const server = io(`${process.env.NEXT_PUBLIC_GATEWAY_BASE_URL}/discussion`, { withCredentials: true });
		setSocket(server);

		return () => {
			server.disconnect();
		};
	}, []);

	useEffect(() => {
		socket?.on("receiveMessage", (msg) => {
			setMessages([...messages, msg]);
		});
	}, [socket, messages]);

	return (
		<div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-3 dark:border-neutral-700 dark:bg-neutral-900">
			<ul className="flex flex-1 flex-col gap-2">
				{messages.map((msg, index) => {
					return <li key={index}>{msg}</li>;
				})}
			</ul>
			<div className="flex gap-3">
				<Input
					ref={inputRef}
					onChange={(e) => setMessage(e.target.value)}
					type="text"
					placeholder="Type a message"
				/>
				<Button
					variant="secondary"
					onClick={() => {
						if (!message) return;
						socket?.emit("sendMessage", message, "");
						setMessages([...messages, message]);
						if (!inputRef.current) return;
						inputRef.current.value = "";
					}}
					disabled={!message}
				>
					Send
				</Button>
			</div>
		</div>
	);
}
