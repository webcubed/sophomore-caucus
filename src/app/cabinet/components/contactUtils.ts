export function formatPhoneNumber(phoneNumber: string): string {
	const digits = phoneNumber.replaceAll(/\D/g, "");
	if (digits.length !== 10) return phoneNumber;
	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function normalizeInstagramHandle(handle: string): string {
	return handle.replace(/^@/, "").trim();
}
