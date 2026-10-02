// 1. เปลี่ยนชื่อ Import เป็น createSwaggerSpec
import { createSwaggerSpec } from 'next-swagger-doc';
import { NextResponse } from 'next/server';

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', 
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'EA Management API',
        version: '1.0',
        description: 'เอกสารอธิบายการใช้งาน API สำหรับระบบจัดการ EA',
      },
    },
  });
  
  return NextResponse.json(spec);
}