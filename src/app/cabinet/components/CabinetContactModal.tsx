"use client";

import type { MemberDirectoryEntry } from "@/lib/members";
import { roleMeta, roleStyles } from "@/lib/members";
import {
	Check,
	Copy,
	ExternalLink,
	Mail,
	MessageCircle,
	Phone,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function formatPhoneNumber(phoneNumber: string): string {
	const digits = phoneNumber.replaceAll(/\D/g, "");

	if (digits.length !== 10) return phoneNumber;

	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function normalizeInstagramHandle(handle: string): string {
	return handle.replace(/^@/, "").trim();
}

function ContactLine({
	fieldKey,
	label,
	value,
	href,
	copyValue,
	Icon,
	copied,
	onCopy,
}: {
	fieldKey: string;
	label: string;
	value: string;
	href?: string;
	copyValue: string;
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	copied: boolean;
	onCopy: (fieldKey: string, value: string) => void;
}) {
	return href ? (
		<div className="flex items-center justify-between gap-4 rounded-xl border border-overlay1/70 bg-surface1/75 px-3 py-3 shadow-inner shadow-base/20 transition-colors hover:border-overlay2/80 hover:bg-surface1/90">
			<div className="min-w-0 flex-1">
				<span className="block text-sm font-medium text-subtext1">{label}</span>
				<span className="mt-1 block break-all text-sm font-semibold text-text">
					{value}
				</span>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				<button
					type="button"
					onClick={() => {
						onCopy(fieldKey, copyValue);
					}}
					className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-overlay1/70 bg-surface0/80 px-3 py-2 text-xs font-semibold text-subtext1 transition-colors hover:border-overlay2 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
					aria-label={`Copy ${label}`}
				>
					{copied ? (
						<Check className="h-3.5 w-3.5" aria-hidden />
					) : (
						<Copy className="h-3.5 w-3.5" aria-hidden />
					)}
					{copied ? "Copied" : "Copy"}
				</button>
				<a
					href={href}
					target={href.startsWith("http") ? "_blank" : undefined}
					rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
					className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-overlay1/70 bg-surface0/80 px-3 py-2 text-xs font-semibold text-subtext1 transition-colors hover:border-overlay2 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
					aria-label={`Open ${label}`}
				>
					<ExternalLink className="h-3.5 w-3.5" aria-hidden />
					Open
				</a>
			</div>
		</div>
	) : (
		<div className="flex items-center justify-between gap-4 rounded-xl border border-overlay1/70 bg-surface1/75 px-3 py-3 shadow-inner shadow-base/20 transition-colors hover:border-overlay2/80 hover:bg-surface1/90">
			<div className="min-w-0 flex-1">
				<span className="block text-sm font-medium text-subtext1">{label}</span>
				<span className="mt-1 block break-all text-sm font-semibold text-text">
					{value}
				</span>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				<button
					type="button"
					onClick={() => {
						onCopy(fieldKey, copyValue);
					}}
					className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-overlay1/70 bg-surface0/80 px-3 py-2 text-xs font-semibold text-subtext1 transition-colors hover:border-overlay2 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
					aria-label={`Copy ${label}`}
				>
					{copied ? (
						<Check className="h-3.5 w-3.5" aria-hidden />
					) : (
						<Copy className="h-3.5 w-3.5" aria-hidden />
					)}
					{copied ? "Copied" : "Copy"}
				</button>
			</div>
		</div>
	);
}

export function CabinetContactModal({
	member,
	onClose,
}: {
	member: MemberDirectoryEntry | null;
	onClose: () => void;
}) {
	const [copiedField, setCopiedField] = useState<string | null>(null);
	const copiedTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		if (!member) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [member, onClose]);

	useEffect(() => {
		return () => {
			if (copiedTimeoutRef.current) {
				window.clearTimeout(copiedTimeoutRef.current);
			}
		};
	}, []);

	if (!member) return null;

	const instagramHandle = normalizeInstagramHandle(
		member.contact.instagramHandle
	);
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
					onClick={(event) => {
						event.stopPropagation();
					}}
				>
					<div className="flex items-start justify-between gap-4 border-b border-overlay1/60 px-4 py-4 sm:px-6">
						<div className="min-w-0">
							<p
								className={`text-sm font-medium ${roleStyles[member.role].text}`}
							>
								{roleMeta[member.role].label}
							</p>
							<h2
								id="cabinet-contact-title"
								className="mt-2 text-2xl font-bold text-text sm:text-3xl"
							>
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
						<ContactLine
							fieldKey="stuyEmail"
							label="Stuy email"
							value={member.contact.stuyEmail}
							href={`mailto:${member.contact.stuyEmail}`}
							copyValue={member.contact.stuyEmail}
							Icon={Mail}
							copied={copiedField === "stuyEmail"}
							onCopy={handleCopy}
						/>
						<ContactLine
							fieldKey="nycEmail"
							label="NYC email"
							value={member.contact.nycEmail}
							href={`mailto:${member.contact.nycEmail}`}
							copyValue={member.contact.nycEmail}
							Icon={Mail}
							copied={copiedField === "nycEmail"}
							onCopy={handleCopy}
						/>
						<ContactLine
							fieldKey="personalEmail"
							label="Personal email"
							value={member.contact.personalEmail}
							href={`mailto:${member.contact.personalEmail}`}
							copyValue={member.contact.personalEmail}
							Icon={Mail}
							copied={copiedField === "personalEmail"}
							onCopy={handleCopy}
						/>
						<ContactLine
							fieldKey="phoneNumber"
							label="Phone"
							value={formatPhoneNumber(member.contact.phoneNumber)}
							href={`tel:${member.contact.phoneNumber}`}
							copyValue={formatPhoneNumber(member.contact.phoneNumber)}
							Icon={Phone}
							copied={copiedField === "phoneNumber"}
							onCopy={handleCopy}
						/>
						<ContactLine
							fieldKey="instagramHandle"
							label="Instagram"
							value={member.contact.instagramHandle}
							href={instagramHref}
							copyValue={`@${instagramHandle}`}
							Icon={MessageCircle}
							copied={copiedField === "instagramHandle"}
							onCopy={handleCopy}
						/>
						<ContactLine
							fieldKey="discordUsername"
							label="Discord"
							value={member.contact.discordUsername}
							copyValue={member.contact.discordUsername}
							Icon={MessageCircle}
							copied={copiedField === "discordUsername"}
							onCopy={handleCopy}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
