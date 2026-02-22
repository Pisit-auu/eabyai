'use client'

import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { generateLicenseKey } from '@/app/component/license'; 
import SidebarItem from "@/app/component/sidebar"
import Navbar from "@/app/component/header"
import axios from 'axios';
import { Select, Avatar, Card, Modal, Tag, Button, Empty, Spin, Popconfirm, message, Input } from 'antd';
import { 
  EyeOutlined , 
  SearchOutlined, 
  ReloadOutlined,
  UserOutlined,
  DesktopOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';



export default function EA() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // --- DATA STATES ---
  const [SymbolAll, setSymbolAll] = useState<SymbolType[]>([])
  const [traderAccountAll, setTraderAccountAll] = useState<TradeAccount[]>([])
  const [TimeframeAll, setTimeframeAll] = useState<TimeframeType[]>([])
  const [modelall, setmodelAll] = useState<ModelType[]>([])
  const [licenseall, setlicenseall] = useState<LicenseKeyType[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchEA, setSearchEA] = useState("");
  const filteredLicense = licenseall.filter((license) =>
  license.nameEA?.toLowerCase().includes(searchEA.toLowerCase())
);
  // --- ADD FORM STATES ---
  const [SymbolSelect, setSymbolSelect] = useState<string | null>(null)
  const [tradderAccountSelect, settradderAccountSelect] = useState<string | null>(null)
  const [timeframeSelect, settimeframeSelect] = useState<string | null>(null)
  const [ModelSelect, setModelSelect] = useState<string | null>(null)
  const [comissionofModelselect, setcomissionofModelselect] = useState(0)

  // --- EDIT MODAL STATES ---
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [EditTradeAccountData, setisEditTradeAccountData] = useState<LicenseKeyType | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // --- AUTH CHECK ---
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])
  const [userData, setUserData] = useState<any>(null)
  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    if (!session?.user?.email) return;
    setIsLoading(true);
    try {
      const [getSymbol, getTraderAccount, getTimeframe, getModel, getlicense] = await Promise.all([
        axios.get(`/api/symbol`),
        axios.get(`/api/tradeaccount/${session.user.email}`),
        axios.get(`/api/timeframe`),
        axios.get(`/api/model`),
        axios.get(`/api/license/${session?.user?.email}`)
      ]);
      setSymbolAll(getSymbol.data);
      setTraderAccountAll(getTraderAccount.data);
      setTimeframeAll(getTimeframe.data);
      setmodelAll(getModel.data);
      setlicenseall(getlicense.data);
       const response = await axios.get(`/api/user/${session.user.email}`);
      const user = response.data;
      setUserData(user[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("ดึงข้อมูลล้มเหลว");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- LOGIC: Filter Models สำหรับฟอร์ม Add ---
  const availableModelsForAdd = useMemo(() => {
    if (!tradderAccountSelect || !SymbolSelect || !timeframeSelect) return [];
    
    const account = traderAccountAll.find(a => a.platformAccountId === tradderAccountSelect);
    if (!account) return [];

    return modelall.filter(m => 
      m.PlatformName === account.PlatformName &&
      m.nameSymbol === SymbolSelect &&
      m.timeframeName === timeframeSelect
    );
  }, [tradderAccountSelect, SymbolSelect, timeframeSelect, traderAccountAll, modelall]);


  // --- HANDLERS ---
  const handledelete = async (license: LicenseKeyType) => {
     if(license?.tradeAccount?.connect === "true"){
          alert("License ตัวนี้ได้เชื่อมกับ TradeAccount แล้ว ไม่สามารถ update ได้")
          return
      }
        const licenseExpire = license.expireDate;
        const matchedBill = license.bills?.find((bill) => {
        if (!bill.exirelicendate || !licenseExpire) return false;

        return (
          new Date(bill.exirelicendate).getTime() ===
          new Date(licenseExpire).getTime()
        );
      });
    // หมดอายุ มีบิลที่ยังไม่ได้ชำระ  ไม่ให้ลบ
        if(license.expire && !matchedBill?.isPaid){
          alert("ไม่สามารถลบได้ กรุณาชำระเงิน")
          return
        }
        const allPaid = license.bills?.every(
          (bill) => bill.isPaid === true
        );
        if(allPaid){
                try {
              await axios.put(`/api/license/${license.licensekey}`, {
                status: false,
              });

              message.success("ลบเสร็จสิ้น");
                fetchData();
              } catch (error) {
                message.error("อัปเดตสถานะไม่สำเร็จ");
              }
              return
        }

          if(matchedBill){
                    try {
                                await axios.delete(`/api/bill/${matchedBill.id}`);
                                await axios.delete(`/api/license/${license.licensekey}`);
                                message.success(`ลบ license ${license.licensekey} สำเร็จ`);
                                fetchData();
                              } catch (error) {
                                console.error(error);
                                message.error("ลบข้อมูลไม่สำเร็จ");
                              }
          }
          
  };

  const handleDownloadEA = async () => {
    try {
      const res = await axios.get("/api/linkmodel");
      if (!res.data?.length) return;
      const { Pathname, namefile } = res.data[0];
      const link = document.createElement("a");
      link.href = Pathname;
      link.download = namefile || "EA.zip";
      link.click();
    } catch (error) {
      console.error("Download EA error:", error);
      message.error("ดาวน์โหลดไม่สำเร็จ");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  };

  // --- ON CHANGE (ADD FORM) ---
  const onChangePlatformId = (value: string) => {
    settradderAccountSelect(value);
    setModelSelect(null);
  };
  const onChangeSymbol = (value: string) => {
    setSymbolSelect(value);
    setModelSelect(null);
  };
  const onChangeTimeframe = (value: string) => {
    settimeframeSelect(value);
    setModelSelect(null);
  };
  const onChangeModel = (value: string) => {
    setModelSelect(value);
    const find = modelall.find(i => i.nameEA === value);
    setcomissionofModelselect(find?.commission ?? 0);
  };

  // --- ON CHANGE (EDIT MODAL) ---
  const clickViewtradeAccount  = (platform: any) => {
    console.log(platform)
    setIsViewOpen(true);
    setIsDetailLoading(false);
    setisEditTradeAccountData(platform);
  };

  // --- ADD SUBMIT ---
  const handleAddmyEA = async () => {
    if (!ModelSelect) {
      message.warning("โปรดเลือก Model EA");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedAccount = traderAccountAll.find(a => a.platformAccountId === tradderAccountSelect);
      const currentPlatform = selectedAccount?.PlatformName ?? "MT5"; 
      
      const key = generateLicenseKey(
        Number(tradderAccountSelect),
        currentPlatform,
        SymbolSelect ?? "ALL",
        timeframeSelect ?? "H1",
        ModelSelect
      );

      const payload = {
        licensekey: key, 
        platformAccountId: tradderAccountSelect,
        nameEA: ModelSelect,
        email: session?.user?.email,
        commission: comissionofModelselect
      };

      await axios.post('/api/license', payload);
      message.success("เพิ่มสำเร็จ");
      await axios.put(`/api/model/${ModelSelect}` , {
            downloadCount : 1
      }
      );
      setSymbolSelect(null);
      settimeframeSelect(null);
      settradderAccountSelect(null);
      setModelSelect(null);
      setcomissionofModelselect(0);
      
      fetchData(); 
    } catch (error) {
      console.error(error);
      message.error('คุณสร้าง model นี้ไปแล้ว');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActions = (platform: any) => [
    <EyeOutlined
        key="view"
        className="text-slate-400 hover:!text-blue-500"
        onClick={() => {
          clickViewtradeAccount(platform);
          setIsViewOpen(true);
          
        }}
      />,
    <Popconfirm
      key="delete"
      title={`ลบ ${platform.licensekey} ?`}
      onConfirm={() => handledelete(platform)}
      okButtonProps={{ danger: true }}
    >
      <DeleteOutlined className="text-slate-400 hover:!text-red-500 transition-colors cursor-pointer" />
    </Popconfirm>
  ];

  // --- RENDER ---
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen bg-[#F1F5F9] flex flex-col font-sans text-slate-800 overflow-hidden">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        isAdmin={session?.user.role ==='admin'}
        userImage={userData?.image }
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className={`bg-[#1E293B] transition-all duration-300 shadow-xl z-20 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
          <div className={`w-64 flex flex-col py-6 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <SidebarItem label="Dashboard" href="/home" />
                      <SidebarItem label="User Profile" href="/user" />
                      <SidebarItem label="TradeAccount" href="/trade-account" />
                      <SidebarItem label="Expert Advisor" href="/EA" />
                      <SidebarItem label="Billing" href="/Bill" />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Expert Advisor Management</h1>
                <p className="text-slate-500 text-sm mt-1">
                  <span className="font-semibold text-blue-600">{session?.user?.email}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-semibold">
                  Total Your EA: {licenseall.length}
                </div>
                
                {licenseall.length !== 0 && (
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadEA}
                    className="!bg-green-500 hover:!bg-green-400 !border-none !text-white"
                  >
                    Download EA
                  </Button>
                )}

                <Button 
                  shape="circle" 
                  size="large"
                  icon={<ReloadOutlined />} 
                  onClick={fetchData} 
                  loading={isLoading} 
                  className="border-slate-200 text-slate-500 hover:text-blue-600"
                />
              </div>
            </div>

            {/* Add New Account Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg">
                </div>
                <h2 className="text-lg font-bold text-slate-700">Add New your Expert Advisor</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
                <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 pl-1">Platform Id</label>
                  <Select
                    className="w-full h-[46px]"
                    size="large"
                    placeholder="Select Platform Id"
                    value={tradderAccountSelect}
                    onChange={onChangePlatformId}
                    options={traderAccountAll.map((item) => ({
                      value: item.platformAccountId,
                      label: (
                        <div className="flex items-center gap-2">
                          <DesktopOutlined /> {item.platformAccountId}
                        </div>
                      ),
                    }))}
                  />
                </div>
                 
                <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 pl-1">Symbol</label>
                  <Select
                    className="w-full h-[46px]"
                    size="large"
                    placeholder="Select Symbol "
                    value={SymbolSelect}
                    onChange={onChangeSymbol}
                    options={SymbolAll.map((item) => ({
                      value: item.nameSymbol,
                      label: (
                        <div className="flex items-center gap-2">
                          <DesktopOutlined /> {item.nameSymbol}
                        </div>
                      ),
                    }))}
                  />
                </div>

                <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 pl-1">Timeframe</label>
                  <Select
                    className="w-full h-[46px]"
                    size="large"
                    placeholder="Select Timeframe"
                    value={timeframeSelect}
                    onChange={onChangeTimeframe }
                    options={TimeframeAll.map((item) => ({
                      value: item.nametimeframe,
                      label: (
                        <div className="flex items-center gap-2">
                          <DesktopOutlined /> {item.nametimeframe}
                        </div>
                      ),
                    }))}
                  />
                </div>
      
                <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 pl-1">name EA (model)</label>
                    { availableModelsForAdd.length > 0 ? (
                        <Select
                          className="w-full h-[46px]"
                          size="large"
                          placeholder="Select model"
                          value={ModelSelect}
                          onChange={onChangeModel}
                          options={availableModelsForAdd.map((item) => ({
                            value: item.nameEA,
                            label: (
                              <div className="flex items-center gap-2">
                                <DesktopOutlined /> {item.nameEA}
                              </div>
                            ),
                            disabled: String(item.active) === "false",
                          }))}
                        />
                    ): (
                       <Select
                          className="w-full h-[46px]"
                          size="large"
                          value={"no model"}
                          disabled
                        />
                    )}
                </div>
                 
                <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 pl-1">commission {comissionofModelselect} %</label>
                </div>

                <div className="md:col-span-2">
                  <button 
                    onClick={handleAddmyEA} 
                    disabled={isSubmitting}
                    className={`w-full h-[36px] rounded-lg font-semibold text-white transition-all shadow-md flex items-center justify-center gap-2
                      ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'}
                    `}
                  >
                    {isSubmitting ? <Spin size="small" /> : <> Add</>}
                  </button>
                </div>
              </div>
            </div>
                      <div className="mb-4">
                  <Input
                    allowClear
                    placeholder="Search EA by name..."
                    prefix={<SearchOutlined />}
                    value={searchEA}
                    onChange={(e) => setSearchEA(e.target.value)}
                    className="max-w-md rounded-xl"
                  />
                </div>
            {/* Accounts Grid List */}
            <div>
              <h3 className="text-lg font-bold text-slate-700 mb-4 px-1">Your Expert Advisor</h3>
      
<Modal
  title={
    <div className="flex items-center gap-2 border-b pb-4 ">
      <div className="w-1 h-6 bg-blue-600 rounded-full" />
      <span className="text-xl font-bold text-slate-800">License Information</span>
    </div>
  }
  open={isViewOpen}
  onCancel={() => setIsViewOpen(false)}
  footer={null}
  // --- ส่วนที่ปรับปรุง ---
  centered // ทำให้ Modal อยู่กลางหน้าจอพอดี
  width={650} // ขยายความกว้างเพิ่มขึ้น (จากเดิม 500)
  // ---------------------
>
  {isDetailLoading ? (
    <div className="py-20 text-center"><Spin size="large" /></div>
  ) : EditTradeAccountData ? (
    <div className="space-y-5 py-4 px-2">
      
      <div className="space-y-4">
        {/* กลุ่มข้อมูลทั่วไป */}
        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">EA Name</span>
          <span className="font-bold text-slate-800">{EditTradeAccountData.nameEA}</span>
        </div>
        
        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">License Key</span>
          <span className="font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-100 font-bold tracking-wider">
            {EditTradeAccountData.licensekey}
          </span>
        </div>

        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">Email</span>
          <span className="text-slate-800">{EditTradeAccountData.email}</span>
        </div>

        <hr className="border-slate-100" />

        {/* กลุ่มข้อมูลบัญชีเทรด */}
        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">Account ID</span>
          <span className="font-bold text-slate-900">{EditTradeAccountData.platformAccountId}</span>
        </div>

        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">Platform / Symbol</span>
          <span className="text-slate-800 font-medium">
            {EditTradeAccountData.model?.PlatformName} — {EditTradeAccountData.model?.nameSymbol}
          </span>
        </div>

        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">Server</span>
          <span className="text-slate-600">{EditTradeAccountData.tradeAccount?.Server}</span>
        </div>

        <hr className="border-slate-100" />

        {/* กลุ่มสถานะและวันที่ */}
        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">Status model</span>
          <span className={`px-3 py-0.5 rounded-full text-sm font-black ${
            EditTradeAccountData.active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {EditTradeAccountData.active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>

        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">Expire Date</span>
          <span className={`font-bold ${EditTradeAccountData.expire ? 'text-red-500' : 'text-slate-800'}`}>
            {EditTradeAccountData.expireDate 
              ? new Date(EditTradeAccountData.expireDate).toLocaleDateString('th-TH') 
              : '-'}
          </span>
        </div>

        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">Registration Date</span>
          <span className="text-slate-700 font-medium">
            {EditTradeAccountData.createdAt 
              ? new Date(EditTradeAccountData.createdAt).toLocaleDateString('th-TH') 
              : '-'}
          </span>
        </div>
      </div>

    </div>
  ) : (
    <Empty description="No Data Found" />
  )}
</Modal>
              {/* LIST CARDS */}
              {isLoading ? (
                <div className="flex justify-center py-20"><Spin size="large" /></div>
              ) : licenseall.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                  <Empty description="No trading accounts found. Add one above!" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredLicense.map((license) => (
                    <Card
                      key={license.id}
                      hoverable
                      className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                      actions={getActions(license)}
                      styles={{ body: { padding: '20px' } }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Tag 
                          color={license.expire ? 'error' : 'success'} 
                          className="m-0 px-3 py-0.5 rounded-full uppercase text-xs font-bold"
                        >
                          {license.expire ? 'Expired : โปรดต่ออายุ' : 'ยังไม่หมดอายุ'}
                        </Tag>
                        <span className="text-xs text-slate-400">
                          {new Date(license.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <Card.Meta
                        avatar={
                          <Avatar
                            size={48}
                            style={{
                              backgroundColor:
                              license.tradeAccount?.connect === "true"
                                ? '#52c41a'
                                : '#ff4d4f',
                              border: '2px solid white',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            icon={<UserOutlined />}
                          />
                        }
                        title={
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-mono font-bold text-slate-800">{license.nameEA}</span>
                          </div>
                        }
                        description={
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-slate-600 font-bold">
                              <span className="text-blue-600 break-all text-xs">Key: {license.licensekey}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                              <DesktopOutlined />
                              <span>Trading Account: {license.platformAccountId}</span>
                            </div>
                            {license.expireDate && (
                              <div className="text-[10px] text-orange-500 font-medium">
                                Expires: {new Date(license.expireDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}