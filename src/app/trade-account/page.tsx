'use client'

import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

import SidebarItem from "@/app/component/sidebar"
import Navbar from "@/app/component/header"
import axios from 'axios';
import { Select, Avatar, Card, message, Tag, Button, Empty, Spin,Popconfirm  } from 'antd';
import { 
  EditOutlined, 
  PlusOutlined, 
  ReloadOutlined,
  UserOutlined,
  DesktopOutlined,
  DeleteOutlined
} from '@ant-design/icons';




export default function UserPage() {
    const [isEditTradeAccountOpen, setisEditAccountOpen] = useState(false)
    const [EditTradeAccountData, setisEditAccountData] = useState<TradeAccount | null>(null)
    const [platformedit, setplatformedit] = useState("")
    const [accountid, setaccountid] = useState("")
    const [investorPasswordedit, setInvestoredit] = useState("")
    const onClose = () => {
      setisEditAccountOpen(false)
    }
    const clickEdittradeAccount  = async (account: any) => {
      const getdata = await axios.get(`/api/tradeaccount/${account.platformAccountId}`)

          if(getdata.data[0].connect === "true"){
            alert('ไม่สามารถ Edit ได้เนื่องจากยังเชื่อมกับ EA อยู่ ')
            fetchData();
            return
          }
      setisEditAccountOpen(true)

      setisEditAccountData(account)
      
      console.log("Setting ID:", account);
      console.log("Setting ID:", account.id);
      setaccountid(account.platformAccountId)
      setplatformedit(account.PlatformName)
      setInvestoredit(account.InvestorPassword)
     
    }
    

    // 2. สร้างฟังก์ชันที่ return array ของ actions โดยรับ account เป็น parameter
    const getActions = (account: any) => [
      <EditOutlined 
        key="edit" 
        className="text-slate-400 hover:!text-blue-500" 
        onClick={() => clickEdittradeAccount(account)} // ส่ง account เข้าไปตรงนี้
      />,
    
                 <Popconfirm
                    key="delete"
                    title="ลบบัญชีเทรด"
                    description="คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีนี้?"
                    onConfirm={() => handledelete(account.platformAccountId)}
                    okText="ลบ"
                    cancelText="ยกเลิก"
                  >
                    <DeleteOutlined
                      className="text-slate-400 hover:!text-red-500 transition-colors cursor-pointer"
                    />
                  </Popconfirm>
    ];
  // --- STATE ---
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [idTrader, setIdTrader] = useState("") 
  const [InvestorPw, setInvestorPW] = useState("") 
  const [platformSelect, setPlatformSelect] = useState<string | null>(null)
  
  const [platformAll, setPlatformAll] = useState<PlatformType[]>([])
  const [traderAccountAll, setTraderAccountAll] = useState<TradeAccount[]>([])
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter()
  const { data: session, status } = useSession()

  // --- ACTIONS ---
  useEffect(() => {
    if (status === 'unauthenticated' ) {
      router.push('/')
    }
  }, [status, router])
  // --- EFFECTS ---
 
    const [userData, setUserData] = useState<any>(null)

  // ฟังก์ชันดึงข้อมูล (แยกออกมาเพื่อให้เรียกใช้ใหม่ได้เมื่อมีการเพิ่มข้อมูล)
  const fetchData = useCallback(async () => {
    if (!session?.user?.email) return;
    
    setIsLoading(true);
    try {
      // ✅ เพิ่ม .catch ท้าย axios เพื่อดัก Error เฉพาะจุด
      // ถ้า Error ให้ return object ที่มี data เป็น [] แทน
      const [getPlatform, getTraderAccount] = await Promise.all([
        axios.get(`/api/platform`).catch(() => ({ data: [] })), 
        axios.get(`/api/tradeaccount/${session.user.email}`).catch(() => ({ data: [] })),
      ]);

      setPlatformAll(getPlatform.data);
      setTraderAccountAll(getTraderAccount.data);
       const response = await axios.get(`/api/user/${session.user.email}`);
      const user = response.data;
      setUserData(user[0]);

    } catch (error) {
      // ตรงนี้จะไม่ทำงานแล้ว เพราะเราดัก Error ไปแล้วข้างบน
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- HANDLERS ---
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleAddTrader = async () => {
    if(idTrader === "" || !platformSelect){
      alert("กรุณากรอก ID และเลือก Platform")
      return
    }
    const passwordRegex =  /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
     if (InvestorPw === "") {
        alert("กรุณากรอกรหัสผ่าน");
        return
      } else if (!passwordRegex.test(InvestorPw)) {
        alert("รหัสต้องความยาว 8 ตัวอักษร และ รหัสผ่านต้องมีตัวเลข ตัวอักษร และอักขระพิเศษอย่างน้อย 1 ตัว");
        return
      }

    setIsSubmitting(true);
    // console.log(idTrader)
    // console.log(platformSelect)
    // console.log(session?.user?.email)
    
    try {
      await axios.post('/api/tradeaccount', { 
        platformAccountId: idTrader,
        InvestorPassword : InvestorPw,
        PlatformName: platformSelect, 
        user : session?.user?.email
      })
      
      // Reset Form
      setIdTrader("")
      setInvestorPW("")
      setPlatformSelect(null)
      
      // Refresh Data ทันที
      await fetchData(); 
      
    } catch (error) {
      console.error(error)
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setIsSubmitting(false);
    }
  };

    const handledelete = async (id: String) => {
      const getdata = await axios.get(`/api/tradeaccount/${id}`)
      console.log(getdata.data[0].connect)
      if(getdata.data[0].connect === "true"){
        alert('ไม่สามารถลบได้เนื่องจากยังเชื่อมกับ EA อยู่')
        fetchData();
        return
      }
            try {
              await axios.delete(`/api/tradeaccount/${id}`)
              message.success(`ลบ ${id} สำเร็จ` )
              fetchData();
          } catch (error) {
              message.error("เกิดข้อผิดพลาดในการลบ")
          }
            console.log("Setting ID:", id);
          };
    const handleUpdate = async () => {
        if (!accountid || !platformedit) {
          message.warning("กรุณากรอก Platform ID และเลือก Platform ให้ครบถ้วน");
          return;
        }
        const passwordRegex =  /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
        if (investorPasswordedit === "") {
            alert("กรุณากรอกรหัสผ่าน");
            return
          } else if (!passwordRegex.test(investorPasswordedit)) {
            alert("รหัสต้องความยาว 8 ตัวอักษร และ รหัสผ่านต้องมีตัวเลข ตัวอักษร และอักขระพิเศษอย่างน้อย 1 ตัว");
            return
          }

        try {
          // เรียก API เพื่ออัพเดทข้อมูล โดยอ้างอิงจาก platformAccountId เดิม (ตัวที่กำลังแก้ไข)
          await axios.put(`/api/tradeaccount/${EditTradeAccountData?.platformAccountId}`, {
            platformAccountId: accountid, // ID ใหม่ (หรือ ID เดิมถ้าไม่ได้แก้)
            PlatformName: platformedit ,
            InvestorPassword:investorPasswordedit
          });

          message.success("อัพเดทข้อมูลสำเร็จ");
          setisEditAccountOpen(false); // ปิดหน้าต่าง Modal
          fetchData(); // โหลดข้อมูลมาแสดงใหม่

        } catch (error) {
          console.error("Update Error:", error);
          message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
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
              isAdmin={session?.user.role ==='admin'}
              userImage={userData?.image }
            />

        <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <aside className={`bg-[#1E293B] transition-all duration-300 shadow-xl z-20 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
                <div className={`w-64 flex flex-col py-6 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                   
                                 <SidebarItem label="Dashboard" href="/home" />
                                 <SidebarItem label="User Profile" href="/user" />
                                 <SidebarItem label="TradeAccount" href="/trade-account" />
                                 <SidebarItem label="Expert Advisor" href="/EA" />
                                 <SidebarItem label="Billing" href="/Bill" />
                </div>
              </aside>


        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Account Management</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Manage your trading accounts linked to <span className="font-semibold text-blue-600">{session?.user?.email}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-semibold">
                    Trading Account : {traderAccountAll.length} Account
                 </div>
                 <Button shape="circle" icon={<ReloadOutlined />} onClick={fetchData} loading={isLoading} />
              </div>
            </div>

            {/* Add New Account Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg">
                </div>
                <h2 className="text-lg font-bold text-slate-700">Add New Account</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 pl-1">Trading ID</label>
                  <input 
                    type="text" 
                    placeholder="Ex. 88990011" 
                    value={idTrader}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setIdTrader(value);
                        }
                      }}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                
                <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 pl-1">Platform</label>
                  <Select
                    className="w-full h-[46px]"
                    size="large"
                    placeholder="Select Platform"
                    value={platformSelect}
                    onChange={(val) => setPlatformSelect(val)}
                    options={platformAll.map((item) => ({
                      value: item.nameplatform,
                      label: (
                        <div className="flex items-center gap-2">
                          <DesktopOutlined /> {item.nameplatform}
                        </div>
                      ),
                    }))}
                  />
                </div>
                       <div className="md:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 pl-1">Investor Password</label>
                  <input 
                    type="text" 
                    placeholder="Ex. 123456aB@" 
                    value={InvestorPw}
                    onChange={(e) => setInvestorPW(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <button 
                    onClick={handleAddTrader} 
                    disabled={isSubmitting}
                    className={`w-full h-[46px] rounded-lg font-semibold text-white transition-all shadow-md flex items-center justify-center gap-2
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
              <h3 className="text-lg font-bold text-slate-700 mb-4 px-1">Your Portfolios</h3>
                        {isEditTradeAccountOpen  && (
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
                  <EditOutlined /> แก้ไขบัญชีเทรด
                </h2>

                {/* เนื้อหา Form */}
                <div className="space-y-4">
        

              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                  <Select
                    className="w-full h-[46px]"
                    size="large"
                    placeholder="Select Platform"
                    value={platformedit}

                    onChange={(val) => setplatformedit(val)}
                    options={platformAll.map((item) => ({
                      value: item.nameplatform,
                      label: (
                        <div className="flex items-center gap-2">
                          <DesktopOutlined /> {item.nameplatform}
                        </div>
                      ),
                    }))}
                  />
                </div>
              {/* Row 2: Email */}
              <div>
                
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform ID</label>
                <input
                  type="number"
                  min={0}
                  name="Platform"
                  value={accountid}
                   onChange={(e) => setaccountid(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              </div>
               <div>
                
                <div >
                  <label className="text-sm font-semibold text-slate-600 pl-1">Investor Password</label>
                  <input 
                    type="text" 
                    placeholder="Ex. 123456aB@" 
                  value={investorPasswordedit}
                   onChange={(e) => setInvestoredit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              </div>
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="bg-slate-100 text-slate-500 px-3 py-2 rounded-lg border border-slate-200">
                    {EditTradeAccountData?.email}
                      </div>
                  </div>

          

            </div>

            {/* Footer Buttons */}
           <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => setisEditAccountOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
              >
                ยกเลิก
              </button>
              <button
                // ⚠️ เอาคอมเมนต์ออก และเรียกใช้ handleUpdate
                onClick={handleUpdate}
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
              ) : traderAccountAll.length === 0 ? (
                 <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                    <Empty description="No trading accounts found. Add one above!" />
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {traderAccountAll.map((account) => (
                    <Card 
                      key={account.id}
                      hoverable
                      className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                      actions={getActions(account)}
                      styles={{ body: { padding: '20px' } }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Tag color={account.connect === 'true' ? 'success' : 'error'} className="m-0 px-3 py-0.5 rounded-full uppercase text-xs font-bold">
                           {account.connect === 'true' ? 'Connected' : 'Disconnected'}
                        </Tag>
                        <span className="text-xs text-slate-400">{new Date(account.createdAt).toLocaleDateString()}</span>
                      </div>

                      <Card.Meta
                        avatar={
                          <Avatar
                            size={48}
                            icon={<UserOutlined />}
                            style={{
                              backgroundColor: account?.connect === 'true' ? '#52c41a' : '#ff4d4f',
                              border: '2px solid white',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                          />
                        }
                        title={
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-slate-800">
                              {account?.platformAccountId || 'Unknown ID'}
                            </span>
                          </div>
                        }
                        description={
                          <div className="mt-1 flex flex-col gap-1">
                            {/* Platform Info: แสดงเฉพาะเมื่อมีค่า */}
                            {account?.PlatformName && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <DesktopOutlined className="text-xs" />
                                <span className="text-sm font-semibold">{account.PlatformName}</span>
                              </div>
                            )}

                            {/* Account Details Box */}
                            <div className="space-y-0.5 border-l-2 border-slate-100 pl-2 mt-1">
                              <div className="text-xs text-slate-500 truncate" title={account?.Server}>
                                <span className="text-slate-400">Server :</span> {account?.Server || 'ยังไม่ได้ Connect'}
                              </div>
                              
                              <div className="text-xs text-slate-500">
                                <span className="text-slate-400">Leverage :</span> {account?.Leverage ? `1:${account.Leverage}` : 'ยังไม่ได้ Connect'}
                              </div>

                              {account?.fullname && (
                                <div className="text-xs font-medium text-slate-600 truncate mt-1" title={account.fullname}>
                                  {account.fullname}
                                </div>
                              )||(<div className="text-xs font-medium text-slate-600 truncate mt-1" title="null">
                                  ยังไม่ได้ Connect กับ MT5
                                </div>)}
                            </div>
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