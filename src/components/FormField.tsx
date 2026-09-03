type FormFieldProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
	type?: "text" | "url" | "textarea";
};

export const FormField: React.FC<FormFieldProps> = ({
	label,
	value,
	onChange,
	placeholder,
	required = false,
	type = "text",
}) => {
	const inputClasses =
		"w-full rounded-lg border border-overlay1/60 bg-surface0/60 px-3 py-2 text-sm text-text placeholder:text-subtext0/60 transition duration-150 focus:border-blue/70 focus:outline-none focus:ring-2 focus:ring-blue/30";

	return (
		<div className="space-y-1.5">
			<label className="block text-sm font-medium text-subtext1">
				{label}
				{required && <span className="text-red ml-1">*</span>}
			</label>
			{type === "textarea" ? (
				<textarea
					value={value}
					onChange={(event) => {
						onChange(event.target.value);
					}}
					placeholder={placeholder}
					required={required}
					rows={4}
					className={inputClasses}
				/>
			) : (
				<input
					type={type}
					value={value}
					onChange={(event) => {
						onChange(event.target.value);
					}}
					placeholder={placeholder}
					required={required}
					className={inputClasses}
				/>
			)}
		</div>
	);
};
