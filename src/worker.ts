import puppeteer from "@cloudflare/puppeteer";

export interface Env {
	MYBROWSER: puppeteer.BrowserWorker
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { searchParams } = new URL(request.url);
		const url = searchParams.get("url");
		if (!url) {
			return new Response(
				"Please add the ?url=https://example.com/ parameter"
			);
		}
		const browser = await puppeteer.launch(env.MYBROWSER);
		const page = await browser.newPage();
		await page.setViewport({ width: 1920, height: 1080 });
		await page.goto(url);
		const img = (await page.screenshot()) as Buffer;
		await browser.close();
		return new Response(img, {
			headers: {
				"content-type": "image/jpeg",
			},
		});
	},
};
