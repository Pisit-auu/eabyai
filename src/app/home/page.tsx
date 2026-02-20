'use client'

import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { generateLicenseKey } from '@/app/component/license'; // import มาใช้
import SidebarItem from "@/app/component/sidebar"
import Navbar from "@/app/component/header"
import axios from 'axios';
import Link from "next/link";
import { MiniChart } from "@/app/component/MiniChart";
import { Modal,Table, Avatar, Card, Badge, Tag, Button, Empty, Spin } from 'antd';

import dayjs from 'dayjs';
import { 
  SearchOutlined , 
  DollarOutlined  ,
  ReloadOutlined,
  UserOutlined,
  DesktopOutlined,
  DownloadOutlined
} from '@ant-design/icons';
export default function Dashborad() {

  // trade history
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const tradeColumns = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    render: (text:any) => (
      <span className="text-slate-500 text-sm">
        {/* แปลง Unix Timestamp (วินาที) เป็น Date Format */}
        {new Date(text * 1000).toLocaleString('th-TH', {
            day: '2-digit', month: '2-digit', year: '2-digit', 
            hour: '2-digit', minute: '2-digit'
        })}
      </span>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (type:any) => {
      const isBuy = type === 'buy';
      return (
        <Tag color={isBuy ? 'success' : 'error'} className="font-semibold uppercase">
          {type}
        </Tag>
      );
    },
  },
  {
    title: 'Volume',
    dataIndex: 'volume',
    key: 'volume',
    align: 'right' as const, 
    render: (vol: any) => <span className="font-mono">{vol.toFixed(2)}</span>,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    align: 'right'as const,
    render: (price:any) => <span className="font-mono text-slate-700">{price.toFixed(5)}</span>,
  },{
    title: 'Profit',
    dataIndex: 'profit',
    key: 'profit',
    align: 'right'as const,
    render: (profit:any) => <span className="font-mono text-slate-700">{profit.toFixed(5)}</span>,
  }
];
  // เพิ่ม State ใน Dashboard component
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStats, setSelectedStats] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [SymbolOpen ,SetSymbolOpen ] = useState("")
  // ฟังก์ชันดึงข้อมูลเมื่อกดปุ่ม Search
  const handleViewDetails = async (platform: any) => {
    setIsDetailLoading(true);
    setIsDetailsOpen(true);
    SetSymbolOpen(platform.model.nameSymbol)
    try {
      // ดึงข้อมูล ID/Pass/Server จาก TraderAccount ที่มีอยู่ใน State (traderAccountAll)
      const accData = traderAccountAll.find(a => a.platformAccountId === platform.platformAccountId);
      console.log(traderAccountAll)
      if (!accData) return alert("Account data not found");

      const res = await axios.post("/api/account/details", {
        accountId: parseInt(accData.platformAccountId),
        investorPassword: accData.InvestorPassword , // ต้องมั่นใจว่ามีฟิลด์นี้
        server: accData.Server,
        symbol: platform.model.nameSymbol
      });
      console.log(res.data)
      setSelectedStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDetailLoading(false);
    }
  };

    // 2. สร้างฟังก์ชันที่ return array ของ actions โดยรับ account เป็น parameter
    const getActions = (platform: any) => [
      <SearchOutlined 
        key="LookeMore" 
        className="text-slate-400 hover:!text-green-700 transition-colors"
        onClick={() => handleViewDetails(platform)} // แก้จาก handledelete เป็นตัวใหม่
      />,
     
      <Link href={`/Bill`}>
        <DollarOutlined
          className="text-slate-400 hover:!text-green-700 transition-colors cursor-pointer"
        />
      </Link>
      ,
 
    ];
  // --- STATE ---
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [traderAccountAll, setTraderAccountAll] = useState<TradeAccount[]>([])
  const [licenseall, setlicenseall] = useState<LicenseKeyType[]>([])
  
  const [isLoading, setIsLoading] = useState(true);
  

  const router = useRouter()
  const { data: session, status } = useSession()
  // SELECT

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
      const [getTraderAccount, getlicense] = await Promise.all([
        axios.get(`/api/tradeaccount/${session.user.email}`),
        axios.get(`/api/license/${session.user.email}`)
      ]);

      // 1. ดึงข้อมูล JSON ที่ได้จาก API
      const userData = getTraderAccount.data;
      console.log(userData)


      // 3. เซ็ตค่าลง State
      setTraderAccountAll(userData);
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

    const clickopentotaltrade = async () => {
      setIsTradeOpen(true)
  }


  // --- HANDLERS ---
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

   

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
                <h1 className="text-2xl font-bold text-slate-800">Report Your EA</h1>
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
                
                 <Link href={`/EA`}>
                  <Button
                  className="!bg-green-500 hover:!bg-green-400 !border-none !text-white"
                >
                  Add Your EA
                </Button>
                  </Link>
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
 

            <div>
              <h3 className="text-lg font-bold text-slate-700 mb-4 px-1">Your Expert Advisor</h3>
        
              
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
                           {/* --- ส่วนกราฟที่เพิ่มเข้ามา --- */}
                            <div className="mt-4 py-2 bg-slate-50/50 rounded-xl border border-slate-100 relative">
                                <div className="absolute top-2 left-3 flex items-center gap-2">
                                  <span className="text-[9px] uppercase font-bold text-slate-400">{license.model?.nameSymbol} : 100 แท่งล่าสุด</span>
                                  <Badge status="processing" color={license.active ? '#52c41a' : '#999'} />
                                </div>
                                <MiniChart 
                                  symbol={license.model?.nameSymbol} // เช่น "XAUUSD"
                                  color={license.active ? '#10b981' : '#f43f5e'} 
                                  count={100} />
                            </div>
                            {/* --------------------------- */}
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
                <Modal
                    title={
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                        <span className="text-lg font-bold text-slate-800">Account Report: {selectedStats?.name}</span>
                      </div>
                    }
                    open={isDetailsOpen}
                    onCancel={() => setIsDetailsOpen(false)}
                    footer={null}
                    width={650} // ขยายความกว้างอีกนิดเพื่อให้แถว 3 อันดูไม่อึดอัด
                    centered
                  >
                    {isDetailLoading ? (
                      <div className="py-20 text-center"><Spin size="large" /></div>
                    ) : selectedStats ? (
                      <div className="space-y-4">
                        {/* แถวที่ 1: 3 คอลัมน์ (Highlight ตัวเลขให้เด่น) */}
                        <div className="flex gap-4">
                          <div className="flex-1 p-4 bg-gradient-to-b from-blue-50/50 to-white border border-blue-100 rounded-2xl shadow-sm">
                            <p className="text-blue-500 text-[11px] font-bold uppercase tracking-wider mb-1">Balance</p>
                            <p className="text-2xl font-black text-blue-700 leading-none">
                              ${selectedStats.balance.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Equity</p>
                            <p className="text-2xl font-black text-slate-800 leading-none">
                              ${selectedStats.equity.toLocaleString()}
                            </p>
                          </div>

                          <div 
            className={`flex-1 p-4 border rounded-2xl shadow-sm ${
              Number(selectedStats.filtered_profit) >= 0 
                ? 'bg-green-200 border-green-200'  // ปรับสีให้เข้มขึ้น (ลบ /30 ออก)
                : 'bg-red-100 border-red-200'        // ใช้ rose แทน red จะดูแพงกว่า
            }`}
          >
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
              Number(selectedStats.filtered_profit) >= 0 ? 'text-green-300' : 'text-red-600'
            }`}>
              Profit
            </p>

            <p className={`text-2xl font-black leading-none ${
              Number(selectedStats.filtered_profit) >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {/* แสดงเครื่องหมาย + ถ้าเป็นกำไร */}
              {Number(selectedStats.filtered_profit) >= 0 ? '+' : ''}{selectedStats.filtered_profit}
            </p>
          </div>
                        </div>

                        {/* แถวที่ 2: 2 คอลัมน์ (ขยายขนาดฟอนต์ให้สมดุลกับความยาว card) */}
                        <div className="flex gap-4">
                          <div className="flex-1 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center">
                            <div>
                              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Total Trades</p>
                              <p className="text-xl font-bold text-slate-700">{selectedStats.trade_markers.length} <span className="text-sm font-normal text-slate-400 ml-1">Orders</span></p>
                            </div>
                            <SearchOutlined 
                              key="LookeMore" 
                              className="text-slate-400 hover:!text-green-700 transition-colors text-2xl"
                              onClick={clickopentotaltrade}
                            />
               
                          </div>
                          <div className="flex-1 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center">
                            <div>
                              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Success Rate</p>
                              <p className="text-xl font-bold text-slate-700">{selectedStats.winrate}%</p>
                            </div>
                 
                          </div>
                        </div>

                        {/* ส่วนกราฟ (ปรับความโค้งและเงาให้เข้าชุดกัน) */}
                        <div className="mt-2">
                          <div className="border border-slate-200 rounded-[2rem] p-4 bg-white shadow-md overflow-hidden">
                            <div className="flex justify-between mb-2 px-2">
                              <span className="text-xs font-bold text-slate-500 uppercase">Market View</span>
                              <span className="text-xs font-mono text-blue-500 bg-blue-50 px-2 rounded">{SymbolOpen}</span>
                            </div>
                            <MiniChart 
                              symbol={SymbolOpen}
                              data={selectedStats.candlesticks}
                              trades={selectedStats.trade_markers}
                              height={320} 
                              count={1000}
                            />
                          </div>
                        </div>
                      </div>
                    ) : <Empty />}
                  </Modal>
                  <Modal
                    title={
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                        <span className="text-lg font-bold text-slate-800">Trade History</span>
                      </div>
                    }
                    open={isTradeOpen}
                    onCancel={() => setIsTradeOpen(false)}
                    footer={null}
                    width={700} // ขยายอีกนิดเพื่อให้ตารางไม่อึดอัด
                      >
                        {isDetailLoading ? (
                          <div className="py-20 text-center"><Spin size="large" /></div>
                        ) : selectedStats ? (
                          <div className="space-y-4">
                             <div className="flex gap-4">
                          <div className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <p className="text-blue-500 text-[11px] font-bold uppercase tracking-wider mb-1">Total Trades</p>
                            <p className="text-2xl font-black text-blue-700 leading-none">
                              {selectedStats.trades_count}
                            </p>
                          </div>
                          <div className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Win Rate</p>
                            <p className="text-2xl font-black text-slate-800 leading-none">
                              {selectedStats.winrate}%
                            </p>
                          </div>
                          <div className={`flex-1 p-4 border rounded-2xl shadow-sm ${
                              Number(selectedStats.filtered_profit) >= 0 
                                ? 'bg-green-200 border-green-200'  // ปรับสีให้เข้มขึ้น (ลบ /30 ออก)
                                : 'bg-red-100 border-red-200'        // ใช้ rose แทน red จะดูแพงกว่า
                            }`}
                          >
                            <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                              Number(selectedStats.filtered_profit) >= 0 ? 'text-green-300' : 'text-red-600'
                            }`}>
                              Profit
                            </p>

                            <p className={`text-2xl font-black leading-none ${
                              Number(selectedStats.filtered_profit) >= 0 ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {/* แสดงเครื่องหมาย + ถ้าเป็นกำไร */}
                              {Number(selectedStats.filtered_profit) >= 0 ? '+' : ''}{selectedStats.filtered_profit}
                            </p>
                          </div>
                        </div>



                            {/* --- ส่วนตาราง Trade History --- */}
                            <Table 
                              columns={tradeColumns} 
                              dataSource={selectedStats.trade_markers}
                              rowKey="time" // ใช้ time เป็น unique key (หรือ index ถ้า time ซ้ำ)
                              pagination={{ pageSize: 10 }} // แบ่งหน้าละ 5 รายการ
                              size="small" // ขนาดตารางกะทัดรัด
                              scroll={{ y: 300 }} // ถ้าเยอะให้ scroll แนวตั้งได้
                            />
                            
                          </div>
                        ) : <Empty description="No Data" />}
                        </Modal>
                  
          </div>
        </main>
      </div>
    </div>
  )
}