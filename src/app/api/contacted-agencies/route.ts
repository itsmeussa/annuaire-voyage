import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "contacted-agencies.json");

interface ContactedAgency {
  id: string;
  contacted: boolean;
  contactedBy: string;
  contactedAt: string;
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
  }
}

function readData(): Record<string, ContactedAgency> {
  ensureDataFile();
  const content = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(content);
}

function writeData(data: Record<string, ContactedAgency>) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET - Retrieve all contacted agencies
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading contacted agencies:", error);
    return NextResponse.json({}, { status: 500 });
  }
}

// POST - Update contacted status for an agency
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, contacted, contactedBy } = body;

    if (!id) {
      return NextResponse.json({ error: "Agency ID is required" }, { status: 400 });
    }

    const data = readData();

    if (contacted) {
      data[id] = {
        id,
        contacted: true,
        contactedBy: contactedBy || "Unknown",
        contactedAt: new Date().toISOString(),
      };
    } else {
      delete data[id];
    }

    writeData(data);

    return NextResponse.json({ success: true, data: data[id] || null });
  } catch (error) {
    console.error("Error updating contacted agency:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
