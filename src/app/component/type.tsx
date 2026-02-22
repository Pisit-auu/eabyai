// --- TYPES ---
type PlatformType = {
  id: number
  nameplatform: string
}

type UserType = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string;
  image: string | null;
  role : string;
};
type BillType = {
  id: number;
  isPaid: boolean;
  email:string
  expire:boolean
  profit: number;
  commission: number;

  exirelicendate: string;
  createdAt: string;

  licenseId: number;

  license?: LicenseKeyType | null;
};
type LicenseKeyType = {
  id: number;
  email: string;
  licensekey: string;
  expire: boolean;
  status: boolean;
  active: boolean;
  expireDate: string | null; 
  platformAccountId: string;
  nameEA: string;
  createdAt: string;
  updatedAt: string;
  billId: number | null;
  tradeAccount?: TradeAccount; 
  model?: ModelType; // แทนค่าที่ดึงมาจาก model Model
   bills?: BillType[];
};

type TradeAccount = {
  id: number;
  platformAccountId: string;
  InvestorPassword : String;
  Server : string;
  Leverage : string;
  fullname : string;
  connect: string;
  email: string;
  PlatformName: string;
  createdAt: string;
  user: UserType;
  platform: PlatformType;
};
type TimeframeType = {
  id: number
  nametimeframe: string
}
type SymbolType = {
  id: number
  nameSymbol: string
}
type LinkdownloadType = {
  id: number
  namefile: string
  Pathname: string
}
type ModelType = {
  id: number;
  nameEA: string;
  // Field ปกติ
  nameSymbol: string;
  timeframeName: string;
  PlatformName: string;
  filePath: string;
  commission: number;
  downloadCount: number;
  
  // Enum (active) - แปลงเป็น String หรือระบุค่าเจาะจง
  active: 'true' | 'false';

  // DateTime - เมื่อส่งผ่าน API จะกลายเป็น String (ISO)
  createdAt: string; 

  // Relation Fields (ถ้าคุณใช้ include ตอน query)
  // ใส่ ? ไว้เผื่อบางครั้งไม่ได้ include มา
  symbol?: SymbolType;
  timeframe?: TimeframeType;
  platform?: PlatformType;
  licenses?: LicenseKeyType[];
};

