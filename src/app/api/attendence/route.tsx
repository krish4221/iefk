// pages/api/attendens.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, phone, barcodeData } = req.body;

    if (!barcodeData || !name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const savedQRCode = await prisma.attendens.create({
        data: {
          data: barcodeData,
          // Optionally store name, email, and phone if needed in your model
          name,
          email,
          phone,
        },
      });
      return res.status(200).json(savedQRCode);
    } catch (error) {
      console.error("Error saving QR code:", error);
      return res.status(500).json({ message: "Error saving QR code" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
