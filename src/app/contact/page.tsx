"use client";

import { FloatingCard } from "@/components/FloatingCard";
import { Stagger } from "@/components/TransitionProvider";
import copy from "@/util/copy";
import { ArrowUpRight, Copy, Mail, MailPlus } from "lucide-react";
import { siInstagram } from "simple-icons/icons";

const socials = [
	{
		label: "Instagram",
		href: "https://www.instagram.com/stuyfreshmancaucus/",
		Icon: InstagramIcon,
	},
];

const contacts = [
	{
		label: "Caucus",
		value: "TBD",
		href: "mailto:TBD",
		Icon: Mail,
	},
	{
		label: "Other",
		value: "REDACTED",
		href: "mailto:REDACTED",
		Icon: MailPlus,
	},
];

export default function Contact() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
			<div className="text-center">
				<Stagger>
					<h1>Contact</h1>
				</Stagger>
				<Stagger>
					<p className="mt-3 sm:mt-4">Get in touch with our cabinet!</p>
				</Stagger>
			</div>

			<section className="mt-8 sm:mt-12 grid w-full max-w-5xl grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-2">
				<Stagger>
					<FloatingCard className="w-full">
						<h2 className="text-2xl font-semibold mb-4">Socials</h2>
						<div className="mt-2 space-y-3">
							{socials.map(({ label, href, Icon }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between gap-2 sm:gap-3 rounded-md border border-ctp-overlay1/40 bg-ctp-surface0/60 px-3 sm:px-4 py-2 sm:py-3 text-ctp-text transition-all duration-200 hover:-translate-y-0.5 hover:border-ctp-overlay1/70 hover:bg-ctp-surface0/80"
								>
									<span className="flex items-center gap-2 sm:gap-3">
										<span className="flex h-8 sm:h-10 w-8 sm:w-10 aspect-square items-center justify-center rounded-full bg-ctp-surface1 text-ctp-text/90 shrink-0">
											<Icon className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden />
										</span>
										<span className="font-semibold text-sm sm:text-base truncate">
											{label}
										</span>
									</span>
									<ArrowUpRight
										className="h-4 sm:h-5 w-4 sm:w-5 text-ctp-subtext1 ml-2 sm:ml-5 shrink-0"
										aria-hidden
									/>
								</a>
							))}
						</div>
					</FloatingCard>
				</Stagger>
			</section>

			<section className="mt-8 sm:mt-10 grid w-full max-w-5xl grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-2 lg:items-center">
				<Stagger>
					<FloatingCard className="w-full max-w-xl mx-auto lg:mx-0">
						<h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
						<div className="space-y-3">
							{contacts.map(({ label, value, href, Icon }) => (
								<div
									key={label}
									className="w-full flex items-center gap-2 sm:gap-3 rounded-md border border-ctp-overlay1/40 bg-ctp-surface0/60 px-3 sm:px-4 py-2 sm:py-3 text-ctp-text transition-all duration-200 hover:-translate-y-0.5 hover:border-ctp-overlay1/70 hover:bg-ctp-surface0/80"
									role="group"
								>
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-3 flex-1 min-w-0"
									>
										<span className="flex h-8 sm:h-10 w-8 sm:w-10 aspect-square items-center justify-center rounded-full bg-ctp-surface1 text-ctp-text/90 shrink-0">
											<Icon className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden />
										</span>
										<span className="flex flex-col text-left w-full min-w-0">
											<span className="text-xs sm:text-sm font-semibold text-ctp-subtext1">
												{label}
											</span>
											<span className="font-semibold truncate text-sm sm:text-base">
												{value}
											</span>
										</span>
									</a>
									<button
										type="button"
										onClick={async (event) => {
											event.preventDefault();
											event.stopPropagation();
											await copy(value);
										}}
										title="Copy to clipboard"
										className="cursor-pointer inline-flex h-8 ml-2 sm:ml-5 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg border border-ctp-overlay1/60 bg-ctp-surface1/60 text-ctp-subtext1 shadow-[0px_6px_12px_rgba(0,0,0,0.18)] transition duration-150 hover:-translate-y-px hover:border-ctp-lavender/60 hover:bg-ctp-surface1/90 hover:text-ctp-text hover:shadow-[0px_10px_18px_rgba(0,0,0,0.22)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ctp-lavender/60 shrink-0"
									>
										<Copy className="h-4 sm:h-5 w-4 sm:w-5" aria-hidden />
										<span className="sr-only">Copy {label}</span>
									</button>
								</div>
							))}
						</div>
					</FloatingCard>
				</Stagger>
			</section>
		</main>
	);
}

function SimpleIconSvg({
	icon,
	...props
}: { icon: { path: string } } & React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			fill="currentColor"
			role="img"
			focusable="false"
			{...props}
		>
			<path d={icon.path} />
		</svg>
	);
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
	return <SimpleIconSvg icon={siInstagram} {...props} />;
}
