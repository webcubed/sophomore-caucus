// Catppuccin Macchiato palette — single source of truth for the accent picker.
// Kept free of Sanity imports so the app runtime can use it without pulling
// the studio bundle into the site.
export const MACCHIATO = {
	rosewater: "#f4dbd6",
	flamingo: "#f0c6c6",
	pink: "#f5bde6",
	mauve: "#c6a0f6",
	red: "#ed8796",
	maroon: "#ee99a0",
	peach: "#fab387",
	yellow: "#eed49f",
	green: "#a6da95",
	teal: "#8bd5ca",
	sky: "#91d7e3",
	sapphire: "#7dc4e4",
	blue: "#8aadf4",
	lavender: "#b7bdf8",
} as const;

export type MacchiatoColor = keyof typeof MACCHIATO;

// Sanity dropdown options: "Blue  #8aadf4" → value "blue".
export const colorList = (Object.keys(MACCHIATO) as MacchiatoColor[]).map(
	(name) => ({
		title: `${name[0].toUpperCase()}${name.slice(1)}  ${MACCHIATO[name]}`,
		value: name,
	})
);
