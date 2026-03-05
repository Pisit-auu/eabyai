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
  DownloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';


export default function EA() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [downloaddetailopen, setdownloaddetailopen] = useState(false)

  // --- DATA STATES ---
  const [SymbolAll, setSymbolAll] = useState<SymbolType[]>([])
  const [traderAccountAll, setTraderAccountAll] = useState<TradeAccount[]>([])
  const [TimeframeAll, setTimeframeAll] = useState<TimeframeType[]>([])
  const [modelall, setmodelAll] = useState<ModelType[]>([])
  const [licenseall, setlicenseall] = useState<LicenseKeyType[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchEA, setSearchEA] = useState("");
  const filteredLicense = licenseall.filter((license) => {
  const keyword = searchEA.trim().toLowerCase();

  if (!keyword) return true;

  return [
    license.nameEA,
    license.licensekey,
    license.platformAccountId
  ]
    .filter(Boolean)
    .some(v => String(v).toLowerCase().includes(keyword));
});
  // --- ADD FORM STATES ---
  const [SymbolSelect, setSymbolSelect] = useState<string | null>(null)
  const [tradderAccountSelect, settradderAccountSelect] = useState<string | null>(null)
  const [timeframeSelect, settimeframeSelect] = useState<string | null>(null)
  const [ModelSelect, setModelSelect] = useState<string | null>(null)
  const [comissionofModelselect, setcomissionofModelselect] = useState(0)
      const [eadetailopen, seteadetailopen] = useState(false)

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
     if(license?.status){
          alert("License ตัวนี้ได้ถูกใส่ หรือ เคยใส่ไปใน EA แล้ว ไม่สามารถลบ ได้")
          return
      }
        const licenseExpire = license.expireDate;
        const matchedBill = license.bills?.find((bill) => {
        if (!bill.exirelicendate || !licenseExpire) return false;

        return (
          new Date(bill.exirelicendate).getTime() === new Date(licenseExpire).getTime()
        );
      });
      
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
  //  console.log(platform)
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
      await axios.put(`/api/user/${session?.user?.email}`, { 
          stepId: 3
      });
      window.location.reload()
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
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [modeldetailopen, setmodeldetailopen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const openPreview = (src: string) => {
  setPreviewImage(src);
};
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
          <div className={`w-64 flex flex-col py-6 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>                                                            <SidebarItem label="User" href="/user" />
                                                            <SidebarItem label="Dashboard" href="/dashboard" />
                                                            <SidebarItem label="Trade Account" href="/trade-account" />
                                                            <SidebarItem label="Expert Advisor" href="/EA" />
                                                            <SidebarItem label="Billing" href="/Bill" />
                                                            <SidebarItem label="Document " href="/document" />
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
              <>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadEA}
                  className="!bg-green-500 hover:!bg-green-400 !border-none !text-white"
                >
                  Download EA
                </Button>

                <Button
                  icon={<InfoCircleOutlined />}
                  onClick={() => setdownloaddetailopen(true)}
                  className="!bg-blue-500 hover:!bg-blue-400 !border-none !text-white"
                >
                  วิธีติดตั้ง EA บนเครื่อง
                </Button>
              </>
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
                           <button onClick={() => seteadetailopen(true)}>
                    <InfoCircleOutlined style={{ color: "blue" }} />
                  </button>
              
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
                <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 pl-1">Trading Account ID</label>
                  <Select
                    className="w-full h-[46px]"
                    size="large"
                    placeholder="Select Trading AccountID"
                    value={tradderAccountSelect}
                    onChange={onChangePlatformId}
                    notFoundContent={<Empty description="ไม่พบ Trading Account โปรดเพิ่มบัญชีที่หน้า Trade Account" />}
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
                 <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 pl-1">
  name EA (model)
        <button onClick={() => setmodeldetailopen(true)}>
          <InfoCircleOutlined style={{ color: "blue" }} />
        </button>
</label>
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
                  placeholder="Search EA or Platform Account ID..."
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
          <Modal
            className="!rounded-2xl"
            rootClassName="custom-modal" 
            title={
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                <span className="text-xl font-black text-slate-800 tracking-tight">
                  รายละเอียด Model ของเรา
                </span>
              </div>
            }
            open={modeldetailopen}
            onCancel={() => setmodeldetailopen(false)}
            footer={null}
            width={820}
            centered
          >
            <div className="space-y-6 pt-2 bg-gradient-to-b from-white to-slate-50/50 rounded-2xl">
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-4 py-3 rounded-xl border border-blue-100 flex items-start gap-4 shadow-sm">
                <p className="text-slate-600 text-sm leading-7">
                  ระบบ <span className="font-bold text-blue-600">AI Expert Advisor</span> ของเรา ถูกพัฒนาเพื่อค้นหาจุดเข้าเทรดที่แม่นยำ โดยผ่านการทดสอบจริงและเปิดให้ใช้งานแล้ว 2 โมเดลหลัก
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CARD 1 */}
                <div className="group relative rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(251,191,36,0.15)] hover:-translate-y-1 transition-all duration-500 border border-amber-50 p-6 flex flex-col">
  
                    {/* top glow */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 rounded-t-3xl" />

                    {/* Header */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold tracking-wider rounded-full border border-amber-200/50">
                        GOLD MODEL
                      </span>
                      <h3 className="text-4xl font-black text-slate-800 mt-3 tracking-tight">
                        XAUUSD
                      </h3>
                    </div>

                    {/* Image Preview Button */}
                    <button
                      type="button"
                      onClick={() => openPreview("/XAUUSDcurveback.png")}
                      className="mb-5 overflow-hidden rounded-xl border border-slate-100 shadow-sm relative block w-full outline-none focus:ring-2 focus:ring-amber-400 group/img"
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors z-10 flex items-center justify-center">
                          <span className="opacity-0 group-hover/img:opacity-100 text-white bg-black/50 px-3 py-1 rounded-full text-xs transition-opacity">
                            คลิกเพื่อดูภาพขยาย
                          </span>
                      </div>
                      <img
                        src="/XAUUSDcurveback.png"
                        alt="XAUUSD Equity Curve"
                        className="w-full h-48 object-cover group-hover/img:scale-105 transition-transform duration-700 ease-in-out relative z-0"
                      />
                    </button>

                    {/* Basic Info */}
                    <div className="space-y-3 text-sm mb-5">
                      {[
                        ["Timeframe", "H1 (1 ชั่วโมง)"],
                        ["Platform", "MT5"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center border-b border-slate-50 pb-2">
                          <span className="text-slate-500 font-medium">{k}</span>
                          <span className="font-bold text-slate-800">{v}</span>
                        </div>
                      ))}
                    </div>
                        <div className="mt-auto bg-slate-50 rounded-2xl p-4 border border-slate-100/60 mb-2">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                        <h4 className="font-bold text-slate-800 text-sm">Forward Test Results</h4>
                        <span className="text-[10px] text-slate-400 font-medium">16/02/26 - 27/02/26</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                         <div className="flex justify-between">
                          <span className="text-slate-500">Win Rate :</span>
                          <span className="font-bold text-indigo-500">94.28%</span>
                        </div> 
                        <div className="flex justify-between">
                          <span className="text-slate-500">Order :</span>
                          <span className="font-semibold text-slate-700">35 order</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">win :</span>
                          <span className="font-bold text-emerald-500">33 </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">loss :</span>
                          <span className="font-bold text-emerald-500">2 </span>
                        </div>
                       
                      </div>
                    </div>
                    {/* Backtest Stats Box */}
                    <div className="mt-auto bg-slate-50 rounded-2xl p-4 border border-slate-100/60">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                        <h4 className="font-bold text-slate-800 text-sm">Backtest Results</h4>
                        <span className="text-[10px] text-slate-400 font-medium">17/01/25 - 30/01/26</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Deposit:</span>
                          <span className="font-semibold text-slate-700">$100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Net Profit:</span>
                          <span className="font-bold text-emerald-500">+502.34</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Profit Factor:</span>
                          <span className="font-bold text-indigo-500">2.95</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Win Rate:</span>
                          <span className="font-bold text-amber-500">94.48%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Max DD:</span>
                          <span className="font-semibold text-rose-500">47.97%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Total Trades:</span>
                          <span className="font-semibold text-slate-700">471</span>
                        </div>
                      </div>
                    </div>
                </div>

                {/* CARD 2 */}
                {/* ===== CARD EURUSD ===== */}
                <div className="group relative rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-500 border border-blue-50 p-6 flex flex-col">
                  
                  {/* top glow */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 rounded-t-3xl" />

                  {/* Header */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider rounded-full border border-blue-200/50">
                      FOREX MODEL
                    </span>
                    <h3 className="text-4xl font-black text-slate-800 mt-3 tracking-tight">
                      EURUSD
                    </h3>
                  </div>

                  {/* Image Preview Button */}
                  <button
                    type="button"
                    onClick={() => openPreview("/EURUSDcurveback.png")}
                    className="mb-5 overflow-hidden rounded-xl border border-slate-100 shadow-sm relative block w-full outline-none focus:ring-2 focus:ring-blue-400 group/img"
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors z-10 flex items-center justify-center">
                        <span className="opacity-0 group-hover/img:opacity-100 text-white bg-black/50 px-3 py-1 rounded-full text-xs transition-opacity">
                          คลิกเพื่อดูภาพขยาย
                        </span>
                    </div>
                    <img
                      src="/EURUSDcurveback.png"
                      alt="EURUSD Equity Curve"
                      className="w-full h-48 object-cover group-hover/img:scale-105 transition-transform duration-700 ease-in-out relative z-0"
                    />
                  </button>

                  {/* Basic Info */}
                  <div className="space-y-3 text-sm mb-5">
                    {[
                      ["Timeframe", "H1 (1 ชั่วโมง)"],
                      ["Platform", "MT5"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-slate-500 font-medium">{k}</span>
                        <span className="font-bold text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div  className="mt-auto bg-slate-50 rounded-2xl p-4 border border-slate-100/60 mb-2">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                        <h4 className="font-bold text-slate-800 text-sm">Forward Test Results</h4>
                        <span className="text-[10px] text-slate-400 font-medium">02/02/26 - 13/02/26</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                         <div className="flex justify-between">
                          <span className="text-slate-500">Win Rate :</span>
                          <span className="font-bold text-indigo-500">92.85%</span>
                        </div> 
                        <div className="flex justify-between">
                          <span className="text-slate-500">Order :</span>
                          <span className="font-semibold text-slate-700">14 order</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">win :</span>
                          <span className="font-bold text-emerald-500">13 </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">loss :</span>
                          <span className="font-bold text-emerald-500">1 </span>
                        </div>
                       
                      </div>
                    </div>
                  {/* Backtest Stats Box */}
                  <div className="mt-auto bg-slate-50 rounded-2xl p-4 border border-slate-100/60">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                      <h4 className="font-bold text-slate-800 text-sm">Backtest Results</h4>
                      <span className="text-[10px] text-slate-400 font-medium">15/01/25 - 16/02/26</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Deposit:</span>
                        <span className="font-semibold text-slate-700">$100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Net Profit:</span>
                        <span className="font-bold text-emerald-500">+200.53</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Profit Factor:</span>
                        <span className="font-bold text-indigo-500">2.71</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Win Rate:</span>
                        <span className="font-bold text-blue-500">86.59%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Max DD:</span>
                        <span className="font-semibold text-rose-500">27.41%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Trades:</span>
                        <span className="font-semibold text-slate-700">246</span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Footer Model */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex gap-3 items-start mt-4">
                  <div className="mt-0.5 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                      <h4 className="font-bold text-sm text-slate-800 mb-0.5">ระบบป้องกันความเสี่ยงขั้นสูง (Risk Management)</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                          ทั้ง 2 โมเดลถูกออกแบบให้จัดการ Order อย่างเป็นระบบ ลดการเข้าออเดอร์ผิดเงื่อนไข และควบคุมความเสี่ยงอัตโนมัติ
                      </p>
                  </div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm flex gap-3 items-start">
                <div className="mt-0.5 text-emerald-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v2" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-900 mb-0.5">การคิดค่าบริการ Commision</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    ทั้ง 2 โมเดล จะคิดค่าบริการหลังผู้ใช้ใช้งานทุกๆ 7 วัน โดยจะคิดจาก ค่า %commission ของ model ตัวนั้นๆ จากกำไรที่ EA ของเราทำให้กับผู้ใช้ ซึ่งต้องมากกว่าเท่ากับ 3.3USDขึ้นไป หาก EA ของเราทำกำไรไม่ถึง หรือไม่ได้กำไร เราจะไม่คิดค่า commission
                  </p>
                </div>
              </div>
            </div>
            {previewImage && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

        {/* backdrop */}
        <button
          className="absolute inset-0"
          onClick={() => setPreviewImage(null)}
          aria-label="Close image preview"
        />

        {/* image */}
        <img
          src={previewImage}
          alt="Preview"
          className="relative max-w-[90%] max-h-[90%] rounded-lg z-10"
        />
      </div>
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
                              license?.status 
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
                              <span className="text-blue-600 break-all text-xs">license Key: {license.licensekey}</span>
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
           <Modal
              title=" วิดีโอสอนตั้งค่าTrading Account ID"
              open={eadetailopen}
              onCancel={() => seteadetailopen(false)}
              footer={null}
              width={900}
              centered
              destroyOnHidden
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/RNERTpex5d8?start=55"
                  allowFullScreen
                />
              </div>
            </Modal>
                      <Modal
              title=" วิดีโอสอนตั้งค่าTrading Account ID"
              open={downloaddetailopen}
              onCancel={() => setdownloaddetailopen(false)}
              footer={null}
              width={900}
              centered
              destroyOnHidden
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/s9-dUuK4r3Y?start=0"
                  allowFullScreen
                />
              </div>
            </Modal>
        </main>
      </div>
    </div>
  )
}