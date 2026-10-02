import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  eaUploader: f({
    blob: { maxFileSize: "16MB", maxFileCount: 1 }
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", file.ufsUrl);

      // เอา URL ไปเก็บ DB ได้เหมือนเดิม
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;