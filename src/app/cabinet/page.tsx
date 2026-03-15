"use client";

import { Stagger } from "@/components/TransitionProvider";
import { memberLevelMeta, members, roleMeta, roleStyles } from "@/lib/members";
import { useEffect, useState } from "react";
import { Profile } from "./components/Profile";

export default function About() {
	const [activeRole, setActiveRole] = useState<
		keyof typeof roleMeta | undefined
	>(undefined);
	const [tocOpen, setTocOpen] = useState(false);
	const roles = Object.keys(roleMeta) as Array<keyof typeof roleMeta>;
	const memberLevels = Object.keys(memberLevelMeta) as Array<
		keyof typeof memberLevelMeta
	>;
	const ActiveRoleIcon = activeRole ? roleMeta[activeRole].icon : undefined;

	useEffect(() => {
		const isMobile = globalThis.matchMedia("(max-width: 1023px)").matches;
		const rootMargin = isMobile ? "-112px 0px -70% 0px" : "-96px 0px -70% 0px";

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting)
						setActiveRole(entry.target.id as keyof typeof roleMeta);
				}
			},
			{
				rootMargin,
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
			<div className="flex flex-col gap-8 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
				{/* Navigator / TOC */}
				<div className="sticky top-22 z-20 w-full self-start lg:top-24 lg:w-auto">
					{/* Mobile dropdown */}
					<div className="overflow-hidden rounded-xl border border-ctp-overlay0/50 bg-ctp-crust/70 backdrop-blur-2xl lg:hidden">
						<button
							type="button"
							onClick={() => {
								setTocOpen((o) => !o);
							}}
							className="flex w-full items-center justify-between px-4 py-3 text-sm"
						>
							{activeRole ? (
								<span
									className={`flex items-center gap-2 font-medium ${roleStyles[activeRole].text}`}
								>
									{ActiveRoleIcon && (
										<ActiveRoleIcon className="h-4 w-4 shrink-0" />
									)}
									{roleMeta[activeRole].label}
								</span>
							) : (
								<span className="font-medium text-ctp-text">
									Jump to section
								</span>
							)}
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
									{roles.map((role) => {
										const RoleIcon = roleMeta[role].icon;

										return (
											<a
												key={role}
												href={`#${role}`}
												onClick={() => {
													setTocOpen(false);
												}}
												className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${roleStyles[role].hoverBg} ${roleStyles[role].hoverText} ${
													activeRole === role
														? `${roleStyles[role].bg} ${roleStyles[role].text} font-medium`
														: "text-ctp-subtext1"
												}`}
											>
												<RoleIcon className="h-4 w-4 shrink-0" />
												{roleMeta[role].label}
											</a>
										);
									})}
								</div>
							</div>
						</div>
					</div>
					{/* Desktop implementation */}
					<div className="hidden lg:flex lg:flex-col">
						<p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-ctp-subtext0">
							Contents
						</p>
						<nav className="flex flex-col">
							{roles.map((role) => {
								const RoleIcon = roleMeta[role].icon;

								return (
									<a
										key={role}
										href={`#${role}`}
										className={`flex items-center gap-2 border-l-2 py-1.5 pl-3 pr-2 text-sm transition-all duration-150 ${
											activeRole === role
												? `${roleStyles[role].border} ${roleStyles[role].text} font-medium`
												: "border-transparent text-ctp-subtext1 hover:border-ctp-overlay1 hover:text-ctp-text"
										}`}
									>
										<RoleIcon className="h-4 w-4 shrink-0" />
										{roleMeta[role].label}
									</a>
								);
							})}
						</nav>
					</div>
				</div>
				<div className="mx-auto flex w-11/12 flex-col gap-10 rounded-xl border border-ctp-overlay0/70 bg-ctp-crust/40 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-2xl sm:p-6 lg:p-8">
					{roles.map((role) => {
						const RoleIcon = roleMeta[role].icon;
						const roleMembers = members[role];
						const membersByLevel = memberLevels
							.map((level) => ({
								level,
								members: roleMembers[level] ?? [],
							}))
							.filter((group) => group.members.length > 0);
						const ungroupedMembers = roleMembers.ungrouped ?? [];

						return (
							<div key={role} className="space-y-4">
								<div className="border-b border-ctp-overlay0/50 pb-3">
									<h2
										id={role}
										className={`scroll-mt-36 sm:scroll-mt-32 lg:scroll-mt-28 ${roleStyles[role].text}`}
									>
										<span className="inline-flex items-center gap-2">
											<RoleIcon className="h-5 w-5 shrink-0" />
											{roleMeta[role].label}
										</span>
									</h2>
								</div>
								{membersByLevel.map((group) => {
									const memberCount = group.members.length;
									const roleGridClass =
										memberCount === 1
											? "sm:grid-cols-1 xl:grid-cols-1"
											: memberCount === 2
												? "sm:grid-cols-2 xl:grid-cols-2"
												: "sm:grid-cols-2 xl:grid-cols-3";

									return (
										<div key={group.level} className="space-y-3">
											<h3 className="text-sm font-semibold uppercase tracking-wide text-ctp-subtext0">
												{memberLevelMeta[group.level].label}
											</h3>
											<div
												className={`my-4 grid grid-cols-1 gap-5 ${roleGridClass}`}
											>
												{group.members.map((member) => (
													<div
														key={`${member.name}-${role}-${group.level}`}
														className={
															memberCount === 1
																? "mx-auto h-full w-full max-w-lg"
																: "h-full"
														}
													>
														<Stagger>
															<Profile
																name={member.name}
																role={role}
																level={group.level}
																imagePath={member.imagePath}
																description={member.description}
															/>
														</Stagger>
													</div>
												))}
											</div>
										</div>
									);
								})}
								{ungroupedMembers.length > 0 ? (
									<div className="space-y-3">
										<div
											className={`my-4 grid grid-cols-1 gap-5 ${
												ungroupedMembers.length === 1
													? "sm:grid-cols-1 xl:grid-cols-1"
													: ungroupedMembers.length === 2
														? "sm:grid-cols-2 xl:grid-cols-2"
														: "sm:grid-cols-2 xl:grid-cols-3"
											}`}
										>
											{ungroupedMembers.map((member) => (
												<div
													key={`${member.name}-${role}-ungrouped`}
													className={
														ungroupedMembers.length === 1
															? "mx-auto h-full w-full max-w-lg"
															: "h-full"
													}
												>
													<Stagger>
														<Profile
															name={member.name}
															role={role}
															imagePath={member.imagePath}
															description={member.description}
														/>
													</Stagger>
												</div>
											))}
										</div>
									</div>
								) : null}
							</div>
						);
					})}
				</div>
			</div>
		</main>
	);
}
