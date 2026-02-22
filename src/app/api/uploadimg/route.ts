import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
/**
 * @swagger
 * /api/uploadimg:
 *   post:
 *     summary: อัปโหลดรูปภาพไปยัง Cloudinary
 *     description: |
 *       อัปโหลดไฟล์รูปภาพผ่าน multipart/form-data
 *       แล้วส่ง URL ของรูปที่อัปโหลดกลับมา
 *     tags:
 *       - Upload
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: ไฟล์รูปภาพที่ต้องการอัปโหลด
 *
 *     responses:
 *       200:
 *         description: อัปโหลดสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/v1234567890/uploads/image.jpg
 *
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No file uploaded or invalid file type
 *
 *       500:
 *         description: Upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: NextRequest) {
  try {
    // รับข้อมูลจาก formData()
    const formData = await req.formData();
    const file = formData.get('file');

    // ตรวจสอบว่าเป็น File หรือไม่
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded or invalid file type' }, { status: 400 });
    }

    // แปลง Blob เป็น Buffer (ใช้ stream เพื่อป้องกันปัญหาจาก experimental feature)
    const buffer = Buffer.from(await file.arrayBuffer());

    // สร้าง base64 string สำหรับอัปโหลด
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // อัปโหลดภาพไปที่ Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'uploads',
    });

    // ส่ง URL ของไฟล์ที่อัปโหลดกลับไป
    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
