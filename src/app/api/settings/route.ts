import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'src', 'data', 'settings.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(settingsFilePath, 'utf8');
    const settings = JSON.parse(fileContents);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSettings = await request.json();
    fs.writeFileSync(settingsFilePath, JSON.stringify(newSettings, null, 2), 'utf8');
    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error) {
    console.error('Error writing settings:', error);
    return NextResponse.json({ error: 'Failed to write settings' }, { status: 500 });
  }
}
