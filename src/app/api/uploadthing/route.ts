import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
/**
 * @swagger
 * /api/uploadthing:
 *   get:
 *     summary: UploadThing route handler (GET)
 *     description: |
 *       Endpoint ภายในของ UploadThing
 *       ใช้สำหรับจัดการ upload flow และ callback ของระบบ
 *     tags:
 *       - UploadThing
 *     responses:
 *       200:
 *         description: UploadThing GET handler response
 *
 *   post:
 *     summary: อัปโหลดไฟล์ผ่าน UploadThing
 *     description: |
 *       Endpoint สำหรับอัปโหลดไฟล์ผ่าน UploadThing
 *       การ validate และประเภทไฟล์จะถูกกำหนดใน ourFileRouter
 *     tags:
 *       - UploadThing
 *
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: ไฟล์ที่อัปโหลด
 *
 *     responses:
 *       200:
 *         description: Upload สำเร็จ
 *       400:
 *         description: Invalid upload request
 *       500:
 *         description: UploadThing server error
 */
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});