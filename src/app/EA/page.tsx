'use client'

import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { generateLicenseKey } from '@/app/component/license'; // import มาใช้
import SidebarItem from "@/app/component/sidebar"
import Navbar from "@/app/component/header"
import axios from 'axios';
import { Select, Avatar, Card, Badge, Tag, Button, Empty, Spin } from 'antd';
import { 
  EditOutlined, 
  PlusOutlined, 
  ReloadOutlined,
  UserOutlined,
  DesktopOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
export default function EA() {

    const [isEditLicenAccountOpen, setisEditLicenOpen] = useState(false)
    const [EditTradeAccountData, setisEditTradeAccountData] = useState<LicenseKeyType | null>(null)
    const [platformIdedit, setplatformIdedit] = useState("")
    const [timeframeEdit, settimeframeEdit] = useState("")
    const [EditSymbol, settimeEditSymbol] = useState("")
    const [EditModel,setEditModel]= useState("")
    
    const onClose = () => {
      setisEditLicenOpen(false)
    }
    const clickEdittradeAccount = (platform: any) => {
      setisEditLicenOpen(true)
      setisEditTradeAccountData(platform)
      setplatformIdedit(platform.platformAccountId)
      setEditModel(platform.model.nameEA)
      settimeEditSymbol(platform.model.nameSymbol)
      settimeframeEdit(platform.model.timeframeName)
    }

    const handledelete = async (id: string) => {
    await axios.delete(`/api/license/${id}`);
    alert(`ลบ license ${id} สำเร็จ`)
    fetchData()
  };


    // 2. สร้างฟังก์ชันที่ return array ของ actions โดยรับ account เป็น parameter
    const getActions = (platform: any) => [
      <EditOutlined 
        key="edit" 
        className="text-slate-400 hover:!text-blue-500" 
        onClick={() => clickEdittradeAccount(platform)} // ส่ง account เข้าไปตรงนี้
      />,
      <DeleteOutlined 
        key="setting" 
       className="text-slate-400 hover:!text-red-500 transition-colors"
        onClick={() => handledelete(platform.licensekey)} // หรือส่งแค่ ID
      />,
    ];
  // --- STATE ---
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [SymbolAll, setSymbolAll] = useState<SymbolType[]>([])
  const [traderAccountAll, setTraderAccountAll] = useState<TradeAccount[]>([])
  const [TimeframeAll, setTimeframeAll] = useState<TimeframeType[]>([])
  const [modelall, setmodelAll] = useState<ModelType[]>([])
  const [moreluserCanselect, setmodeluserCanSelect] = useState<ModelType[]>([])
  const [licenseall, setlicenseall] = useState<LicenseKeyType[]>([])
  
  const [isLoading, setIsLoading] = useState(true);
  

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter()
  const { data: session, status } = useSession()
  // SELECT
  const [SymbolSelect, setSymbolSelect] = useState<string | null>(null)
  const [tradderAccountSelect, settradderAccountSelect] = useState<string | null>(null)
  const [timeframeSelect, settimeframeSelect] = useState<string | null>(null)
  const [ModelSelect, setModelSelect] = useState<string | null>(null)
  const [comissionofModelselect, setcomissionofModelselect ]  = useState(0)
  const [Boolsymbol, setboolSymbol] = useState(false)
  const [BoolTraderId, setboolTraderId] = useState(false)
  const [BoolTimeframe, setboolTimeframe] = useState(false)
  const [BoolnameEA, setBoolnameEA] = useState(false)
  // --- ACTIONS ---

  // --- EFFECTS ---
  useEffect(() => {
    if (status === 'unauthenticated' ) {
      router.push('/')
    }
  }, [status, router])

  // ฟังก์ชันดึงข้อมูล (แยกออกมาเพื่อให้เรียกใช้ใหม่ได้เมื่อมีการเพิ่มข้อมูล)
  const fetchData = useCallback(async () => {
    if (!session?.user?.email) return;
    
    setIsLoading(true);
    try {
      const [getSymbol, getTraderAccount,getTimeframe,getModel,getlicense] = await Promise.all([
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
   

      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
  fetchData();
}, [fetchData]);
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
  }
};


const onChangeSymbol = (value: string) => {
    // console.log(`selected ${value}`);
    setboolSymbol(true)
    setSymbolSelect(value)
    setModelSelect("null")
    
  };
  const onChangeTimeframe = (value: string) => {
    // console.log(`selected ${value}`);
    setboolTimeframe(true)
    settimeframeSelect(value)
    setModelSelect("null")
    
  };
  const onChangePlatformId = (value: string) => {
    // console.log(`selected ${value}`);
    settradderAccountSelect(value)
    setboolTraderId(true)

    
  };
  const onChangeModel = (value: string) => {
    console.log(`selected ${value}`);
     const findcommision = modelall.filter(
      item => item.nameEA === value
    );

    setModelSelect(value)
   
    setcomissionofModelselect(findcommision[0].commission)
  };

useEffect(() => {
  if (Boolsymbol && BoolTraderId && BoolTimeframe) {
    setBoolnameEA(true);

    const accountselect = traderAccountAll.find(
      item => item.platformAccountId === tradderAccountSelect
    );

    if (!accountselect) return;

    const result = modelall.filter(
      item =>
        item.nameSymbol === SymbolSelect &&
        item.PlatformName === accountselect.PlatformName &&
        item.timeframeName === timeframeSelect
    );

    //console.log(result);
    setmodeluserCanSelect(result);
    
  }
}, [
  Boolsymbol,
  BoolTraderId,
  BoolTimeframe,
  traderAccountAll,
  tradderAccountSelect,
  SymbolSelect,
  timeframeSelect,
  modelall
]);

  // --- HANDLERS ---
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

   const handleAddmyEA = async () => {
    const findPlatform = modelall.filter(item => item.nameEA === ModelSelect)
    const nextWeekObj = dayjs().add(1, 'week'); 
    const nextWeekStr = nextWeekObj.format('YYYYMMDD'); 
    // 2. เตรียมค่าอื่นๆ (สมมติว่าคุณดึงมาจาก State หรือ Form)
    // ถ้าอยากให้ใช้ได้ทุกคู่เงิน ให้ส่งคำว่า "ALL" หรือ "" (ว่าง)

    const currentPlatform = findPlatform[0].PlatformName ; 
    const currentSymbol = SymbolSelect ;     // ถ้า User ไม่เลือกเจาะจง ให้เป็น ALL
    const currentTimeframe = timeframeSelect; 
    
    // 3. เรียกใช้ฟังก์ชัน (ส่งให้ครบ 5 ตัวตามลำดับที่ประกาศไว้)
    const key = generateLicenseKey(
        Number(tradderAccountSelect), // Account ID
        currentPlatform ??"MT5",              // Platform
        currentSymbol?? "ALL",                // Symbol
        currentTimeframe?? "H1",             // Timeframe
        nextWeekStr                   // Date Expire
    );
    console.log(tradderAccountSelect)
    console.log(currentPlatform)
    console.log(currentSymbol)
    console.log(currentTimeframe)
    console.log(nextWeekStr)
     console.log(comissionofModelselect)
    const payload = {
        licensekey: key, 
        platformAccountId: tradderAccountSelect,
        nameEA: ModelSelect ,
        email: session?.user?.email,
        commission : comissionofModelselect
    };


    console.log("Payload to send:", payload);
    if(ModelSelect === null || ModelSelect === "null" ){
      alert("โปรดเลือก model")
      setIsSubmitting(false)
      return
    }
    try {
      await axios.post('/api/license', payload);

      alert("เพิ่มสำเร็จ")
      setboolSymbol(false)
      setboolTraderId(false)
      setboolTimeframe(false)
      setBoolnameEA(false)
      setSymbolSelect(null)
      settimeframeSelect(null)
      settradderAccountSelect(null)
      setModelSelect(null)
      setcomissionofModelselect(0)

      await fetchData(); 
      
    } catch (error) {
      console.error(error)
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="h-screen bg-[#F1F5F9] flex flex-col font-sans text-slate-800 overflow-hidden">
      
      {/* Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`bg-[#1E293B] transition-all duration-300 shadow-xl z-20 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
          <div className={`w-64 flex flex-col py-6 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
           
                                <SidebarItem label="User TradeAccount" href="/user" />
                                  <SidebarItem label="Dashboard" href="/home" />
                                <SidebarItem label="Expert Advisor" href="/EA" />
                                <SidebarItem label="Billing" href="/Bill" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              {/* ฝั่งซ้าย: ข้อความหัวข้อ */}
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Expert Advisor Management</h1>
                <p className="text-slate-500 text-sm mt-1">
                  <span className="font-semibold text-blue-600">{session?.user?.email}</span>
                </p>
              </div>

              {/* ฝั่งขวา: กลุ่ม Action Buttons */}
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
              ) }

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
                    { BoolnameEA ? (
                        <Select
                    className="w-full h-[46px]"
                    size="large"
                    placeholder="Select model"
                    value={ModelSelect}
                    onChange={onChangeModel}
                    options={moreluserCanselect.map((item) => ({
                      value: item.nameEA,
                      label: (
                        <div className="flex items-center gap-2">
                          <DesktopOutlined /> {item.nameEA}
                        </div>
                      ),
                    }))}
                  />
                    ): (
                       <Select
                    className="w-full h-[46px]"
                    size="large"
                    value={"no model"}

                   
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

            {/* Accounts Grid List */}
            <div>
              <h3 className="text-lg font-bold text-slate-700 mb-4 px-1">Your Expert Advisor</h3>
              {isEditLicenAccountOpen  && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
                      <div className="relative bg-white p-6 rounded-lg w-96">

                        {/* ปุ่มปิด */}
                        <button
                          onClick={onClose}
                          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold">
                          ×
                        </button>

                        {/* หัวข้อ */}
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <EditOutlined /> แก้ไข EA ของฉัน
                    </h2>

                    {/* เนื้อหา Form */}
                    <div className="space-y-4">
                    
                           
                         
                               <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Licensekey</label>
                                  <div className="bg-slate-100 text-slate-500 px-3 py-2 rounded-lg border border-slate-200">
                                      {EditTradeAccountData?.licensekey}
                                        </div>
                               </div>
                            
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
                                <Select
                                className="w-full h-[46px]"
                                size="large"
                                placeholder="Select Platform"
                                value={EditModel}
                                onChange={onChangeModel}
                                 options={moreluserCanselect.map((item) => ({
                                  value: item.nameEA,
                                  label: (
                                    <div className="flex items-center gap-2">
                                      <DesktopOutlined /> {item.nameEA}
                                    </div>
                                  ),
                                }))}
                              />
          
                              </div>

             
                             <div>
                                            <Select
                                  className="w-full h-[46px]"
                                    size="large"
                                    placeholder="Select Platform Id"
                                    value={platformIdedit}
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

                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Symbol</label>
                                  <div className="bg-slate-100 text-slate-500 px-3 py-2 rounded-lg border border-slate-200">
                                      {EditSymbol}
                                        </div>
                               </div>
                              
                               <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Timeframe</label>
                                  <div className="bg-slate-100 text-slate-500 px-3 py-2 rounded-lg border border-slate-200">
                                      {timeframeEdit}
                                        </div>
                               </div>



                          </div>

                          {/* Footer Buttons */}
                          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-4">
                            <button
                              onClick={() => setisEditLicenOpen(false)}
                              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                            >
                              ยกเลิก
                            </button>
                            <button
                              // onClick={handleSave}
                              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition-colors"
                            >
                              บันทึกข้อมูล
                            </button>
                          </div>

                        </div>
                      </div>
                    )}
              
              {isLoading ? (
                <div className="flex justify-center py-20"><Spin size="large" /></div>
              ) : licenseall.length === 0 ? (
                 <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                    <Empty description="No trading accounts found. Add one above!" />
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  
                {licenseall.map((license) => (
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
                        {license.expire ? 'Expired : โปรดต่ออายุ' : 'Active'}
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
                            backgroundColor: license.active ? '#52c41a' : '#ff4d4f',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          icon={<UserOutlined />}
                        />
                      }
                      title={
                        <div className="flex items-center justify-between">
                          {/* ✅ แสดง License Key */}
                          <span className="text-sm font-mono font-bold text-slate-800">{license.nameEA}</span>
                        </div>
                      }
                      description={
                        <div className="mt-2 space-y-1">
                          {/* ✅ แสดงชื่อ EA (nameEA) */}
                          <div className="flex items-center gap-2 text-slate-600 font-bold">
                            <span className="text-blue-600">license key : {license.licensekey}</span>
                          </div>
                          
                          {/* ✅ แสดงเลขพอร์ต */}
                          <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <DesktopOutlined />
                            <span>Tradding Account: {license.platformAccountId}</span>
                          </div>

                          {/* ✅ แสดงวันหมดอายุ (ถ้ามี) */}
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