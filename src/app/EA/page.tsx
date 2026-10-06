'use client'

import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { generateLicenseKey } from '@/app/component/license'; 
import SidebarItem from "@/app/component/sidebar"
import { ModelSheet, MODEL_RESULTS } from "@/app/component/ModelSheet"
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
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-800 overflow-hidden">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        isAdmin={session?.user.role ==='admin'}
        userImage={userData?.image }
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className={`bg-white transition-all duration-300 z-20 overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
          <div className={`w-64 h-full border-r border-slate-200 flex flex-col py-4 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <SidebarItem label="User" href="/user" />
            <SidebarItem label="Dashboard" href="/dashboard" />
            <SidebarItem label="Trade Account" href="/trade-account" />
            <SidebarItem label="Expert Advisor" href="/EA" />
            <SidebarItem label="Billing" href="/Bill" />
            <SidebarItem label="Document" href="/document" />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-200">
              <div>
                <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Expert Advisor Management</h1>
                <p className="text-slate-500 text-sm mt-1">
                  <span className="text-slate-600">{session?.user?.email}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="text-sm text-slate-500 px-1">
                  Total EA <span className="num font-semibold text-slate-900 ml-1">{licenseall.length}</span>
                </div>
                
                {licenseall.length !== 0 && (
                  <>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleDownloadEA}
                      type="primary"
                    >
                      Download EA
                    </Button>
                    <Button
                      icon={<InfoCircleOutlined />}
                      onClick={() => setdownloaddetailopen(true)}
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
            <div className="bg-white p-5 md:p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-base font-semibold text-slate-900">Add expert advisor</h2>
                    <button onClick={() => seteadetailopen(true)} aria-label="วิธีเพิ่ม EA" className="text-slate-400 hover:text-blue-600 transition-colors">
                      <InfoCircleOutlined />
                    </button>
              
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
                <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-medium text-slate-700">Trading account ID</label>
                  <Select
                    className="w-full h-10"
                    size="large"
                    placeholder="Select trading account ID"
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
                  <label className="text-sm font-medium text-slate-700">Symbol</label>
                  <Select
                    className="w-full h-10"
                    size="large"
                    placeholder="Select symbol"
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
                  <label className="text-sm font-medium text-slate-700">Timeframe</label>
                  <Select
                    className="w-full h-10"
                    size="large"
                    placeholder="Select timeframe"
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
                 <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
  Model
  <button onClick={() => setmodeldetailopen(true)}>
    <InfoCircleOutlined className="text-blue-500" />
  </button>
</label>
                    { availableModelsForAdd.length > 0 ? (
                        <Select
                          className="w-full h-10"
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
                          className="w-full h-10"
                          size="large"
                          value={"no model"}
                          disabled
                        />
                    )}
                </div>
                 
                <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ">Commission <span className="num">{comissionofModelselect}%</span></label>
                </div>

                <div className="md:col-span-2">
                  <button 
                    onClick={handleAddmyEA} 
                    disabled={isSubmitting}
                    className={`w-full h-[36px] rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2
                      ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
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
                  className="max-w-md rounded-lg"
                />
                </div>
            {/* Accounts Grid List */}
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-3">Your Expert Advisor</h3>
      
<Modal
  title={
    <span className="text-lg font-semibold text-slate-900">License Information</span>
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
          <span className="font-semibold text-slate-800">{EditTradeAccountData.nameEA}</span>
        </div>
        
        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">License Key</span>
          <span className="font-mono bg-slate-50 text-slate-900 px-2 py-0.5 rounded border border-slate-200">
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
          <span className="font-semibold text-slate-900">{EditTradeAccountData.platformAccountId}</span>
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
          <span className={`text-sm font-medium ${
            EditTradeAccountData.active 
              ? 'text-emerald-600' 
              : 'text-rose-600'
          }`}>
            {EditTradeAccountData.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex justify-between items-center text-base">
          <span className="text-slate-500 font-medium">Expire Date</span>
          <span className={`font-semibold ${EditTradeAccountData.expire ? 'text-red-500' : 'text-slate-800'}`}>
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
            title={<span className="text-lg font-semibold text-slate-900">รายละเอียด Model ของเรา</span>}
            open={modeldetailopen}
            onCancel={() => setmodeldetailopen(false)}
            footer={null}
            width={880}
            centered
          >
            <div className="space-y-5 pt-1">
              <p className="text-slate-600 text-sm leading-relaxed max-w-prose">
                ระบบ AI Expert Advisor ของเราพัฒนาเพื่อหาจุดเข้าเทรดที่แม่นยำ ผ่านการทดสอบจริงและเปิดให้ใช้งานแล้ว 2 โมเดลหลัก
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MODEL_RESULTS.map(m => (
                  <ModelSheet key={m.symbol} model={m} onPreview={openPreview} />
                ))}
              </div>

              <dl className="border-t border-slate-200 divide-y divide-slate-200 text-sm">
                <div className="py-3 grid sm:grid-cols-[200px_1fr] gap-1 sm:gap-6">
                  <dt className="font-medium text-slate-900">Risk management</dt>
                  <dd className="text-slate-600 leading-relaxed">ทั้ง 2 โมเดลถูกออกแบบให้จัดการ Order อย่างเป็นระบบ ลดการเข้าออเดอร์ผิดเงื่อนไข และควบคุมความเสี่ยงอัตโนมัติ</dd>
                </div>
                <div className="py-3 grid sm:grid-cols-[200px_1fr] gap-1 sm:gap-6">
                  <dt className="font-medium text-slate-900">การคิดค่าบริการ Commission</dt>
                  <dd className="text-slate-600 leading-relaxed">ทั้ง 2 โมเดล จะคิดค่าบริการหลังผู้ใช้ใช้งานทุกๆ 7 วัน โดยจะคิดจาก ค่า %commission ของ model ตัวนั้นๆ จากกำไรที่ EA ของเราทำให้กับผู้ใช้ ซึ่งต้องมากกว่าเท่ากับ 3.3USDขึ้นไป หาก EA ของเราทำกำไรไม่ถึง หรือไม่ได้กำไร เราจะไม่คิดค่า commission</dd>
                </div>
              </dl>
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
                <div className="bg-white rounded-lg p-10 text-center border border-slate-200">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="ยังไม่มี EA — เลือกบัญชี, Symbol, Timeframe และ Model ด้านบนแล้วกด Add" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredLicense.map((license) => (
                    <Card
                      key={license.id}
                      className="rounded-lg border-slate-200 shadow-sm overflow-hidden"
                      actions={getActions(license)}
                      styles={{ body: { padding: '20px' } }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[15px] font-semibold text-slate-900 truncate">{license.nameEA}</p>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <DesktopOutlined /> <span className="num">{license.platformAccountId}</span>
                          </p>
                        </div>
                        <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-medium ${license.expire ? 'text-rose-600' : 'text-emerald-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${license.expire ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {license.expire ? 'หมดอายุ · โปรดต่ออายุ' : 'ใช้งานได้'}
                        </span>
                      </div>

                      <dl className="mt-4 text-xs divide-y divide-slate-100 border-t border-slate-100">
                        <div className="flex justify-between gap-4 py-2">
                          <dt className="text-slate-500 shrink-0">License key</dt>
                          <dd className="font-mono text-slate-800 break-all text-right">{license.licensekey}</dd>
                        </div>
                        <div className="flex justify-between gap-4 py-2">
                          <dt className="text-slate-500">สถานะ EA</dt>
                          <dd className={license?.status ? 'text-emerald-600' : 'text-rose-600'}>{license?.status ? 'Active' : 'Inactive'}</dd>
                        </div>
                        <div className="flex justify-between gap-4 py-2">
                          <dt className="text-slate-500">สร้างเมื่อ</dt>
                          <dd className="num text-slate-800">{new Date(license.createdAt).toLocaleDateString()}</dd>
                        </div>
                        {license.expireDate && (
                          <div className="flex justify-between gap-4 py-2">
                            <dt className="text-slate-500">หมดอายุ</dt>
                            <dd className="num text-amber-700">{new Date(license.expireDate).toLocaleDateString()}</dd>
                          </div>
                        )}
                      </dl>
                    </Card>
                  ))}
                </div>
              )}
            </div>

          </div>
           <Modal
              title=" วิดีโอสอนเชื่อม Trade Account กับ model เพื่อสร้าง EA"
              open={eadetailopen}
              onCancel={() => seteadetailopen(false)}
              footer={null}
              width={900}
              centered
              destroyOnHidden
            >
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/2Rngq_HoFQs?start=54"
                  allowFullScreen
                />
              </div>
            </Modal>
                      <Modal
              title=" วิดีโอสอนติดตั้ง EA ลงบนเครื่อง"
              open={downloaddetailopen}
              onCancel={() => setdownloaddetailopen(false)}
              footer={null}
              width={900}
              centered
              destroyOnHidden
            >
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/79Ela1oOr6E?start=0"
                  allowFullScreen
                />
              </div>
            </Modal>
        </main>
      </div>
    </div>
  )
}