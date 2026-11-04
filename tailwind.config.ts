import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#120d17", acid: "#d7ff49", bruise: "#b58bff" }, boxShadow: { loud: "7px 7px 0 #d7ff49" } } }, plugins: [] } satisfies Config;
