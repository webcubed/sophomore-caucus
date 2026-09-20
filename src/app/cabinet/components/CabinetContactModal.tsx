"use client";

import type { MemberDirectoryEntry } from "@/lib/members";
import { roleMeta, roleStyles } from "@/lib/members";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ContactLine } from "./ContactLine";
import { formatPhoneNumber, normalizeInstagramHandle } from "./contactUtils";

type ContactField = {
	fieldKey: string;
	label: string;
	value: string;
	href?: string;
	copyValue: string;
};

export function CabinetContactModal({
	member,
	onClose,
}: {
	member: MemberDirectoryEntry | null;
	onClose: () => void;
}) {
	const [copiedField, setCopiedField] = useState<string | null>(null);
	const [imageOpen, setImageOpen] = useState(false);
	const copiedTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		if (!member) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				if (imageOpen) setImageOpen(false);
				else onClose();
			}
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [member, onClose, imageOpen]);

	useEffect(() => {
		return () => {
			if (copiedTimeoutRef.current) {
				window.clearTimeout(copiedTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		setImageOpen(false);
	}, [member]);

	if (!member) return null;

	const instagramHandle = normalizeInstagramHandle(member.contact.instagramHandle);
	const instagramHref =
		instagramHandle && instagramHandle.toLowerCase() !== "no"
			? `https://www.instagram.com/${instagramHandle}`
			: undefined;

	const handleCopy = async (fieldKey: string, value: string) => {
		if (!navigator.clipboard?.writeText) return;
		await navigator.clipboard.writeText(value);
		setCopiedField(fieldKey);
		if (copiedTimeoutRef.current) {
			window.clearTimeout(copiedTimeoutRef.current);
		}
		copiedTimeoutRef.current = window.setTimeout(() => {
			setCopiedField(null);
		}, 1600);
	};

	const contactFields: ContactField[] = [
		{
			fieldKey: "stuyEmail",
			label: "Stuy email",
			value: member.contact.stuyEmail,
			href: `mailto:${member.contact.stuyEmail}`,
			copyValue: member.contact.stuyEmail,
		},
		{
			fieldKey: "nycEmail",
			label: "NYC email",
			value: member.contact.nycEmail,
			href: `mailto:${member.contact.nycEmail}`,
			copyValue: member.contact.nycEmail,
		},
		{
			fieldKey: "personalEmail",
			label: "Personal email",
			value: member.contact.personalEmail,
			href: `mailto:${member.contact.personalEmail}`,
			copyValue: member.contact.personalEmail,
		},
		{
			fieldKey: "phoneNumber",
			label: "Phone",
			value: formatPhoneNumber(member.contact.phoneNumber),
			href: `tel:${member.contact.phoneNumber}`,
			copyValue: formatPhoneNumber(member.contact.phoneNumber),
		},
		{
			fieldKey: "instagramHandle",
			label: "Instagram",
			value: member.contact.instagramHandle,
			href: instagramHref,
			copyValue: `@${instagramHandle}`,
		},
		{
			fieldKey: "discordUsername",
			label: "Discord",
			value: member.contact.discordUsername,
			copyValue: member.contact.discordUsername,
		},
	];

	return (
		<div
			className="fixed inset-0 z-50 bg-base/85 backdrop-blur-md"
			onClick={onClose}
			role="presentation"
		>
			<div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="cabinet-contact-title"
					className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-overlay1/80 bg-mantle/96 shadow-2xl sm:rounded-2xl"
					onClick={(event) => event.stopPropagation()}
				>
					{member.image && member.imageConfig?.enabled !== false && (
						<button
							type="button"
							onClick={() => setImageOpen(true)}
							className="group relative block h-48 w-full cursor-pointer overflow-hidden sm:h-56"
							aria-label={`View full image of ${member.name}`}
						>
							<img
								src={member.image}
								alt={member.name}
								className="h-full w-full object-cover"
								style={{ objectPosition: member.imageConfig?.objectPosition ?? "center 28%" }}
							/>
							<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-base/55 via-transparent to-transparent" />
						</button>
					)}
					<div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6">
						<div className="min-w-0">
							<p className={`text-sm font-medium ${roleStyles[member.role].text}`}>
								{roleMeta[member.role].label}
							</p>
							<h2 id="cabinet-contact-title" className="mt-2 text-2xl font-bold text-text sm:text-3xl">
								{member.name}
							</h2>
							<p className="mt-2 text-sm leading-relaxed text-subtext0">
								Preferred communication: {member.contact.preferredCommunication}
							</p>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-overlay1/60 bg-surface0/70 text-subtext1 transition-colors hover:border-overlay2 hover:text-text"
							aria-label="Close contact details"
						>
							<X className="h-4 w-4" aria-hidden />
						</button>
					</div>

					<div className="grid gap-4 px-4 py-4 sm:px-6 sm:py-6 md:grid-cols-2">
						{contactFields.map((field) => (
							<ContactLine
								key={field.fieldKey}
								fieldKey={field.fieldKey}
								label={field.label}
								value={field.value}
								href={field.href}
								copyValue={field.copyValue}
								copied={copiedField === field.fieldKey}
								onCopy={handleCopy}
							/>
						))}
					</div>
				</div>
			</div>
			{imageOpen && member.image && (
				<div
					className="fixed inset-0 z-[60] flex items-center justify-center bg-base/95 p-4 backdrop-blur-md"
					onClick={(event) => {
						event.stopPropagation();
						setImageOpen(false);
					}}
					role="dialog"
					aria-modal="true"
					aria-label={`Full image of ${member.name}`}
				>
					<button
						type="button"
						onClick={() => setImageOpen(false)}
						className="fixed right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-overlay1/60 bg-surface0/70 text-subtext1 transition-colors hover:border-overlay2 hover:text-text"
						aria-label="Back to contact details"
					>
						<X className="h-4 w-4" aria-hidden />
					</button>
					<img
						src={member.image}
						alt={member.name}
						onClick={(event) => event.stopPropagation()}
						className="max-h-[90vh] max-w-full rounded-xl border border-overlay1/60 object-contain shadow-2xl"
					/>
				</div>
			)}
		</div>
	);
}
