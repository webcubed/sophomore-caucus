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
	// SEO scrapers
	"ahrefsbot",
	"semrushbot",
	// Search crawlers deliberately NOT blocked: they must reach the pages to
	// read X-Robots-Tag: noindex and permanently delist the site.
];

export function proxy(request: NextRequest) {
	const userAgent = request.headers.get("user-agent")?.toLowerCase() ?? "";

	if (BLOCKED_USER_AGENTS.some((bot) => userAgent.includes(bot))) {
		return new NextResponse(null, { status: 403 });
	}

	return NextResponse.next();
}
