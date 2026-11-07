import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// honey: UA list is bypassable by spoofing; pair with robots.txt (compliant
// crawlers) and Vercel firewall rules. Revisit if a new major crawler appears.
const BLOCKED_USER_AGENTS = [
	// AI scrapers
	"gptbot",
	"chatgpt-user",
	"oai-searchbot",
	"claudebot",
	"claude-web",
	"anthropic-ai",
	"perplexitybot",
	"google-extended",
	"ccbot",
	"bytespider",
	"amazonbot",
	"applebot-extended",
	"meta-externalagent",
	"deepseekbot",
	"cohere-ai",
	"youbot",
	// search crawlers (robots.txt already blocks these; this enforces it)
	"googlebot",
	"bingbot",
	"duckduckbot",
	"yandexbot",
	// SEO scrapers
	"ahrefsbot",
	"semrushbot",
];

export function proxy(request: NextRequest) {
	const userAgent = request.headers.get("user-agent")?.toLowerCase() ?? "";

	if (BLOCKED_USER_AGENTS.some((bot) => userAgent.includes(bot))) {
		return new NextResponse(null, { status: 403 });
	}

	return NextResponse.next();
}
