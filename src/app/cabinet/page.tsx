"use client";

import { Stagger } from "@/components/TransitionProvider";
import { members, roleMeta } from "@/lib/members";
import { useEffect, useState } from "react";
import { Profile } from "./components/Profile";

export default function About() {
	const [activeRole, setActiveRole] = useState<
		keyof typeof roleMeta | undefined
	>(undefined);
	const [tocOpen, setTocOpen] = useState(false);
	const roles = Object.keys(roleMeta) as Array<keyof typeof roleMeta>;

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting)
						setActiveRole(entry.target.id as keyof typeof roleMeta);
				}
			},
			{
				rootMargin: "-96px 0px -70% 0px",
				threshold: 0,
			}
		);
		for (const role of roles) {
			const element = document.querySelector(`#${role}`);
			if (element) observer.observe(element);
		}

		return () => {
			observer.disconnect();
		};
	}, []);
	return (
		<main className="flex flex-col gap-36 min-h-screen w-full px-4 pt-28 pb-8 sm:px-6 sm:pt-32 sm:pb-12 lg:px-8">
			<div className="text-center">
				<Stagger>
					<h1>Cabinet</h1>
				</Stagger>
			</div>
			<div className="flex flex-col gap-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
				{/* Navigator */}
				<div className="sticky top-22 z-20 w-full self-start lg:top-24 lg:w-auto">
					{/* Mobile: collapsible dropdown */}
					<div className="overflow-hidden rounded-xl border border-ctp-overlay0/50 bg-ctp-crust/70 backdrop-blur-2xl lg:hidden">
						<button
							type="button"
							onClick={() => {
								setTocOpen((o) => !o);
							}}
							className="flex w-full items-center justify-between px-4 py-3 text-sm"
						>
							<span
								className={`font-medium ${
									activeRole ? roleMeta[activeRole].text : "text-ctp-text"
								}`}
							>
								{activeRole ? roleMeta[activeRole].label : "Jump to section"}
							</span>
							<svg
								className={`h-4 w-4 shrink-0 text-ctp-subtext1 transition-transform duration-200 ${
									tocOpen ? "rotate-180" : ""
								}`}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
						<div
							className={`grid transition-all duration-200 ${
								tocOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
							}`}
						>
							<div className="overflow-hidden">
								<div className="flex flex-col gap-1 border-t border-ctp-overlay0/30 px-2 pb-2 pt-1">
									{roles.map((role) => (
										<a
											key={role}
											href={`#${role}`}
											onClick={() => {
												setTocOpen(false);
											}}
											className={`rounded-lg px-3 py-2 text-sm transition ${roleMeta[role].hoverBg} ${roleMeta[role].hoverText} ${
												activeRole === role
													? `${roleMeta[role].bg} ${roleMeta[role].text} font-medium`
													: "text-ctp-subtext1"
											}`}
										>
											{roleMeta[role].label}
										</a>
									))}
								</div>
							</div>
						</div>
					</div>
					{/* Desktop: minimal sidebar */}
					<div className="hidden lg:flex lg:flex-col">
						<p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-ctp-subtext0">
							Contents
						</p>
						<nav className="flex flex-col">
							{roles.map((role) => (
								<a
									key={role}
									href={`#${role}`}
									className={`border-l-2 py-1.5 pl-3 pr-2 text-sm transition-all duration-150 ${
										activeRole === role
											? `${roleMeta[role].border} ${roleMeta[role].text} font-medium`
											: "border-transparent text-ctp-subtext1 hover:border-ctp-overlay1 hover:text-ctp-text"
									}`}
								>
									{roleMeta[role].label}
								</a>
							))}
						</nav>
					</div>
				</div>
				<div className="mx-auto flex w-11/12 flex-col gap-10 rounded-xl border border-ctp-overlay0/70 bg-ctp-crust/40 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-2xl sm:p-6 lg:p-8">
					{roles.map((role) => (
						<div key={role} className="space-y-4">
							<div className="border-b border-ctp-overlay0/50 pb-3">
								<h2 id={role} className={`scroll-mt-28 ${roleMeta[role].text}`}>
									{roleMeta[role].label}
								</h2>
							</div>
							<div className="my-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 *:h-full">
								{members.map(
									(member) =>
										member.role === role && (
											<Stagger key={`${member.name}-${member.role}`}>
												<Profile
													name={member.name}
													role={member.role}
													imagePath={member.imagePath}
													description={member.description}
												/>
											</Stagger>
										)
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
