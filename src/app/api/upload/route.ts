import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_BUCKET_NAME ="kontextai";
const R2_ACCOUNT_ID = "0a7c28f8a6de61ab6b5ef0561a7d5891";
const R2_ACCESS_KEY = "bb77b8fd37a7a628c135454c2cd05b1a";
const R2_SECRET_KEY ="9aaaa45d41632ece383b92705d9d9803256409dd447cccabe1d5feed4b65b932";
const R2_PUBLIC_DOMAIN = "https://pub-00d80e5f81f241f480f749d5b36902fc.r2.dev";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const key = `${Date.now()}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();

    await s3Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: arrayBuffer,
        ContentType: file.type,
      })
    );

    const url = `${R2_PUBLIC_DOMAIN}/${key}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    );
  }
}
