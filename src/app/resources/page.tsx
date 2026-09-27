"use client";

import type { LucideIcon } from "lucide-react";
import { Stagger } from "@/components/TransitionProvider";
import {
	CircleQuestionMark,
	CircleStar,
	FlaskConical,
	HeartPulse,
	Mail,
	Newspaper,
	Route,
} from "lucide-react";

type Resources = {
	name: string;
	description: string;
	url: string;
	icon: LucideIcon;
};
const resources: Resources[] = [
	{
		name: "Teacher Email Guide",
		description: "Learn how to properly email teachers!",
		url: "https://docs.google.com/document/d/1dVnQkHagjMZy40AnXV4r7JmwPSiwvXZV_MMmlhzEbvc/edit?tab=t.0",
		icon: Mail,
	},
	{
		name: "Stuyvesant Staff Email List",
		description: "The Fall 2026 Stuyvesant staff email directory.",
		url: "https://stuy.entest.org/staff%20email%20list%20Fall%202026%20updated_%20pdf.pdf",
		icon: Mail,
	},
	{
		name: "Sophomore monthly magazine",
		description:
			"A brief overview of what Sophomore Caucus has to offer for this month, including our resources and upcoming events!",
		url: "https://www.instagram.com/p/DdpWVYOib2r/",
		icon: Newspaper,
	},
	{
		name: "Official Unit 1 AP Chemistry Study Guide 26-27",
		description: "The official Unit 1 AP Chemistry study guide for 2026-27.",
		url: "https://docs.google.com/document/d/1Pb7y2LPXEVJjcPq9XA8I_AWsx6f_LlB6rHWG7TWz8CQ/edit?tab=t.d3xer7k4938x",
		icon: FlaskConical,
	},
	{
		name: "Sophomore Caucus Extracurricular Activities Guide",
		description:
			"A guide to extracurricular activities for Stuyvesant sophomores.",
		url: "https://docs.google.com/document/d/1kvo8HDMRVK3RtqtXhcF78Db4KFHdMvwCmaN1pj2xCcU/edit?tab=t.0",
		icon: CircleStar,
	},
	{
		name: "Suicide Prevention",
		description:
			"Resources and information for suicide prevention and support.",
		url: "https://docs.google.com/document/d/1sBOQfI91HhRRXh-VUhLQKzBkzLSn0zDOiwEeW9FKK5Y/edit?tab=t.0",
		icon: HeartPulse,
	},
	{
		name: "Sophomore Caucus Q&A",
		description:
			"Frequently asked questions and answers from the Sophomore Caucus.",
		url: "https://docs.google.com/document/d/1kPC-xYEkF1FdC91UEcHP5_yimnNUxNsLtLPLC1ZpaUQ/edit?tab=t.0",
		icon: CircleQuestionMark,
	},
	{
		name: "AP Chem Roadmap",
		description: "A roadmap for AP Chemistry.",
		url: "https://docs.google.com/document/d/1WLd4Tl6mYBROLGYHLNr5FnYnlU2Gk_CrUJHISv4Zu6c/edit?tab=t.89tbj24s39ph",
		icon: Route,
	},
];

export default function Resources() {
	return (
		<div>
			<div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
				{resources.map((resource) => (
					<Stagger key={resource.name}>
						<a
							href={resource.url}
							target={resource.url.startsWith("http") ? "_blank" : undefined}
							className="flex h-full items-start gap-3 rounded-lg border border-overlay1/60 bg-surface0/50 p-4 transition-colors hover:bg-surface1/60"
						>
							<resource.icon className="mt-0.5 h-5 w-5 shrink-0 text-subtext0" />
							<div className="min-w-0">
								<h2 className="text-sm font-semibold">{resource.name}</h2>
								<p className="mt-0.5 text-xs text-subtext0">
									{resource.description}
								</p>
							</div>
						</a>
					</Stagger>
				))}
			</div>

			<h2 className="mt-6 text-lg font-semibold mx-auto">Stuy Food Map!</h2>
			<iframe
				src="https://www.google.com/maps/d/embed?mid=1mrPR5pzLzQE78MsK0zgHrBFKs6CKnyo"
				width="100%"
				height="500"
				style={{ border: 0 }}
				loading="lazy"
			></iframe>
		</div>
	);
}
