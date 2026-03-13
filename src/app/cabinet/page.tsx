"use client";

import { Stagger } from "@/components/TransitionProvider";
import { members, roleMeta } from "@/lib/members";
import { Profile } from "./components/Profile";

export default function About() {
	const roles = Object.keys(roleMeta) as Array<keyof typeof roleMeta>;
	return (
		<main className="flex flex-col gap-36 min-h-screen w-full px-4 pt-28 pb-8 sm:px-6 sm:pt-32 sm:pb-12 lg:px-8">
			<div className="text-center">
				<Stagger>
					<h1>Cabinet</h1>
				</Stagger>
			</div>
			<div className="flex flex-col gap-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
				{/* Navigator */}
				<div className="mx-auto h-fit w-full rounded-lg bg-ctp-crust/40 p-4 backdrop-blur-2xl sm:w-11/12 sm:p-6 lg:sticky lg:top-24 lg:self-start">
					<div>
						<h2 className="text-lg">Jump to section</h2>
					</div>
					<div className="my-5 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
						{roles.map((role) => (
							<a
								key={role}
								href={`#${role}`}
								className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm text-ctp-subtext1 transition ${roleMeta[role].hoverBg} ${roleMeta[role].hoverText}`}
							>
								<span>{roleMeta[role].label}</span>
							</a>
						))}
					</div>
				</div>
				<div className="mx-auto flex w-11/12 flex-col gap-10 rounded-xl border border-ctp-overlay0/70 bg-ctp-crust/40 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-2xl sm:p-6 lg:p-8">
					{roles.map((role) => (
						<div key={role} className="space-y-4">
							<div className="border-b border-ctp-overlay0/50 pb-3">
								<h2 id={role} className={`${roleMeta[role].text}`}>
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
