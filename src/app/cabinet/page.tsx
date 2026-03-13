"use client";

import { Stagger } from "@/components/TransitionProvider";
import { members } from "@/lib/members";
import { Profile } from "./components/Profile";

export default function About() {
	return (
		<main className="flex flex-col gap-36 min-h-screen w-full px-4 pt-28 pb-8 sm:px-6 sm:pt-32 sm:pb-12 lg:px-8">
			<div className="text-center">
				<Stagger>
					<h1>Cabinet</h1>
				</Stagger>
			</div>
			<div className="grid mx-auto bg-ctp-crust/40 backdrop-blur-2xl w-11/12 gap-8 grid-cols-3 rounded-lg p-16">
				{members.map((member) => (
					<Stagger key={`${member.name}-${member.role}`}>
						<Profile
							name={member.name}
							role={member.role}
							imagePath={member.imagePath}
							description={member.description}
						/>
					</Stagger>
				))}
			</div>
		</main>
	);
}
