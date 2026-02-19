import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // กำหนด "Route" สำหรับการอัปโหลด EA
  eaUploader: f({ 
    blob: { maxFileSize: "16MB", maxFileCount: 1 } 
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", file.url);
      // ตรงนี้คุณสามารถเอา file.url ไปเก็บลง Prisma ได้ครับ
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;