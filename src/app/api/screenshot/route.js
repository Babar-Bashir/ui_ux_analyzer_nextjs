import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ message: 'URL is required' }, { status: 400 });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshotBuffer = await page.screenshot({ type: 'jpeg', fullPage: true });

    return new NextResponse(screenshotBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });

  } catch (error) {
    console.error('Puppeteer error:', error);
    return NextResponse.json({ message: `Failed to capture screenshot: ${error.message}` }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
