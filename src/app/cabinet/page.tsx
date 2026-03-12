"use client";

import { Stagger } from "@/components/TransitionProvider";
import { members } from "@/lib/members";
import { Profile } from "./components/Profile";

export default function About() {
	return (
		<main className="flex flex-col gap-36 min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">
			<div className="text-center mx-auto">
				<Stagger>
					<h2>Meet the team</h2>
				</Stagger>
			</div>
			<div className="grid mx-auto bg-ctp-crust/40 backdrop-blur-2xl w-11/12 gap-8 grid-cols-3 rounded-lg p-16">
				{members.map((member) => (
					<Stagger>
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
