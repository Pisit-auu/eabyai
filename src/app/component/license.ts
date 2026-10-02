// utils/license.ts

const SECRET_SALT = 3737;
const PLATFORM_MAP: { [key: string]: number } = {
  MT4: 1,
  MT5: 2,
};

export function generateLicenseKey(
  traderId: number | string,
  platform: string,
  symbol: string,
  timeframe: string,
  modelName: string
): string {

  const port = Number(traderId);

  if (isNaN(port)) {
    console.error("License Error: Port is invalid", { port });
    return "";
  }

  const platId = PLATFORM_MAP[platform] || 2;

  // helper แปลง string → score
  const getSum = (str: string) =>
    str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const symbolScore = getSum(symbol || "ALL");
  const tfScore = getSum(timeframe || "H1");
  const modelScore = getSum(modelName || "DEFAULT"); // ⭐ เพิ่ม

  const bigPort = BigInt(Math.floor(port));

  // 🔥 ใช้ modelScore แทน expire
  const baseValue =
    bigPort +
    BigInt(
      (symbolScore * platId) +
      tfScore +
      modelScore +
      SECRET_SALT
    );

  const finalCalc = baseValue * BigInt(777);

  const fullKey = finalCalc.toString(16).toUpperCase();

  const checksum = (finalCalc % BigInt(255))
    .toString(16)
    .toUpperCase()
    .padStart(2, "0");

  const result = `${fullKey}${checksum}`;

  return result.match(/.{1,4}/g)?.join("-") || result;
}