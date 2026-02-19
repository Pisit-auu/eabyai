// utils/license.ts

const SECRET_SALT = 3737; 
const PLATFORM_MAP: { [key: string]: number } = { "MT4": 1, "MT5": 2 };

export function generateLicenseKey(
  traderId: number | string, 
  platform: string,         
  symbol: string,            
  timeframe: string,        
  dateExpire: string     
): string {
  
  // แปลงค่า input
  const port = Number(traderId);
  const expire = Number(dateExpire);
  
  // เช็คว่าการแปลงตัวเลขสำเร็จไหม
  // จุดนี้สำคัญ: ถ้าลำดับผิด ค่า expire จะเป็น NaN เพราะมันเอาตัวอักษรมาแปลง
  if (isNaN(port) || isNaN(expire)) {
      console.error("License Error: Port or Date is invalid", { port, expire });
      return "";
  }

  const platId = PLATFORM_MAP[platform] || 2; // Default เป็น 2 (MT5) กันเหนียว

  // แปลงตัวอักษรเป็น ASCII Sum
  const getSum = (str: string) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const symbolScore = getSum(symbol || "ALL");
  const tfScore = getSum(timeframe || "H1");

  /**
   * สูตรคำนวณ (ใช้ BigInt ทุกขั้นตอนเพื่อความแม่นยำสูงสุด):
   * เราแปลงเป็น BigInt ก่อน XOR เพื่อป้องกันปัญหาตัวเลขเกิน 32-bit
   */
  const bigPort = BigInt(Math.floor(port));
  const bigExpire = BigInt(Math.floor(expire));
  
  // คำนวณ
  const baseValue = (bigPort ^ bigExpire) + BigInt((symbolScore * platId) + tfScore + SECRET_SALT);
  
  // คูณตัวเลขมั่วๆ เพื่อกระจายค่า
  const finalCalc = baseValue * BigInt(777);

  // แปลงเป็น Hex (ฐาน 16)
  let fullKey = finalCalc.toString(16).toUpperCase();
  
  // Checksum
  const checksum = (finalCalc % BigInt(255)).toString(16).toUpperCase().padStart(2, '0');

  // จัดรูปแบบ AAAA-BBBB-CCCC
  const result = `${fullKey}${checksum}`;
  return result.match(/.{1,4}/g)?.join('-') || result;
}