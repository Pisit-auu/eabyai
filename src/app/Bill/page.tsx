'use client'

import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import SidebarItem from "@/app/component/sidebar"
import Navbar from "@/app/component/header"
import axios from 'axios';
import { Modal,Select, Table, Card, Tag, Button, Empty, Spin } from 'antd';
import { 
  DollarOutlined  ,
  ReloadOutlined,
  UserOutlined,
  DesktopOutlined,
} from '@ant-design/icons';

export default function Bill() {




  const [filterStatus, setFilterStatus] = useState('UNPAID');
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [licenseall, setlicenseall] = useState<LicenseKeyType[]>([])
  
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter()
  const { data: session, status } = useSession()


  const filteredLicenses = licenseall.filter((license: any) => {
  const isPaid = license.bill?.isPaid || false;
  
  if (filterStatus === 'PAID') return isPaid === true;
  if (filterStatus === 'UNPAID') return isPaid === false;
  return true; 
});

 //bill detail
  const [platformselect, setplatformselect] = useState<any>(null);
  const [selectedStats, setSelectedStats] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [SymbolOpen ,SetSymbolOpen ] = useState("")
  const [BillOpen, setBillOpen] = useState(false);
  const [traderAccountAll, setTraderAccountAll] = useState<TradeAccount[]>([])
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
  const handleBill = async (platform: any) => {
    setplatformselect(platform)
   setBillOpen(true)
   setIsDetailLoading(true);
    SetSymbolOpen(platform.model.nameSymbol)
    try {
      // ดึงข้อมูล ID/Pass/Server จาก TraderAccount ที่มีอยู่ใน State (traderAccountAll)
      const accData = traderAccountAll.find(a => a.platformAccountId === platform.platformAccountId);
      
      if (!accData) return alert("Account data not found");

      const res = await axios.post("/api/account/details", {
        accountId: parseInt(accData.platformAccountId),
        investorPassword: accData.InvestorPassword , // ต้องมั่นใจว่ามีฟิลด์นี้
        server: accData.Server,
        symbol: platform.model.nameSymbol
      });
      console.log(res.data)
      console.log(platform)
      setSelectedStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDetailLoading(false);
    }
  };

 

 


  const getActions = (platform: any) => [
     
      <DollarOutlined  
        key="setting" 
       className="text-slate-400 hover:!text-green-700 transition-colors"
        onClick={() => handleBill(platform)} 
      />,

  ];




const fetchData = useCallback(async () => {
    if (!session?.user?.email) return;
    
    setIsLoading(true);
    try {
      const [getTraderAccount,getlicense] = await Promise.all([
        axios.get(`/api/tradeaccount/${session.user.email}`),
        axios.get(`/api/license`)
      ]);
      setTraderAccountAll(getTraderAccount.data);
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
                <h1 className="text-2xl font-bold text-slate-800">Bill</h1>
                <p className="text-slate-500 text-sm mt-1">
                  <span className="font-semibold text-blue-600">{session?.user?.email}</span>
                </p>
              </div>

              {/* ฝั่งขวา: กลุ่ม Action Buttons & Filter */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* ✅ เพิ่ม Dropdown สำหรับ Filter */}
                <Select
                  defaultValue="UNPAID"
                  style={{ width: 160 }}
                  size="large"
                  onChange={(value) => setFilterStatus(value)}
                  options={[
                    { value: 'UNPAID', label: 'รอชำระเงิน (Unpaid)' },
                    { value: 'PAID', label: 'ชำระแล้ว (Paid)' },
                    { value: 'ALL', label: 'ทั้งหมด (All)' },
                  ]}
                />

                {/* อัปเดตตัวเลขให้แสดงตามจำนวนที่ Filter แล้ว */}
                <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-semibold h-10 flex items-center">
                  Total Your Bill: {filteredLicenses.length}
                </div>
                
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
              <h3 className="text-lg font-bold text-slate-700 mb-4 px-1">Your Billing</h3>
              
              {isLoading ? (
                  <div className="flex justify-center py-20"><Spin size="large" /></div>
                ) : filteredLicenses.length === 0 ? ( // ✅ เปลี่ยนตรงนี้
                  <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                    <Empty description="ไม่มีบิลในสถานะที่คุณเลือก" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredLicenses.map((license: any) => { // ✅ เปลี่ยนตรงนี้
                      const bill = license.bill; 
                      const isPaid = bill?.isPaid || false;
                      const billId = bill?.id ? String(bill.id).padStart(5, '0') : 'N/A';
                      const amount = bill?.totalAmount || 0;

                      return (
                        <Card
                          key={license.id}
                      hoverable
                      className={`rounded-2xl border-2 shadow-sm hover:shadow-md transition-all overflow-hidden relative ${
                        isPaid ? 'border-transparent' : 'border-orange-200 bg-orange-50/30'
                      }`}
                      actions={
                        // ถ้ายังไม่จ่ายเงิน ให้ปุ่มเด่นๆ หน่อย
                        !isPaid 
                          ? [
                              <button
                                key="pay" 
                                className="text-orange-600 font-bold hover:text-orange-700 w-full py-1 flex items-center justify-center gap-2"
                                onClick={() => handleBill(license)}
                              >
                            <DollarOutlined className="text-lg" /> ชำระเงินทันที
                          </button>
                            ]
                          : [
                              <button 
                                key="view" 
                                className="text-slate-500 hover:text-blue-600 w-full py-1"
                                onClick={() => handleBill(license)} // อาจจะเปลี่ยนเป็นดูใบเสร็จ
                              >
                                ดูรายละเอียดใบเสร็จ
                              </button>
                            ]
                      }
                      styles={{ body: { padding: '24px' } }}
          >
            {/* ริบบิ้นด้านข้าง (ตกแต่งให้ดูเหมือนบิล) */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPaid ? 'bg-green-500' : 'bg-orange-500'}`}></div>

            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Invoice #INV-{billId}
                </span>
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(license.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              {/* Status Tag */}
              <Tag 
                color={isPaid ? 'success' : 'warning'} 
                className="m-0 px-3 py-1 rounded-full uppercase text-xs font-bold border-0"
              >
                {isPaid ? 'PAID (ชำระแล้ว)' : 'UNPAID (รอชำระ)'}
              </Tag>
            </div>

            <div className="py-4 border-t border-b border-slate-100 border-dashed mb-4">
              {/* รายละเอียดสินค้า */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700">{license.nameEA}</span>
                <span className="text-sm text-slate-500 font-mono">1 x License</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <DesktopOutlined /> Account: <span className="font-mono">{license.platformAccountId}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <span>License: <span className="text-blue-600 font-mono">{license.licensekey}</span></span>
              </div>
            </div>

            {/* ยอดรวม */}
            <div className="flex items-end justify-between">
              <span className="text-sm text-slate-500 font-semibold">Total Amount</span>
              <div className="text-right">
                <span className={`text-2xl font-black ${isPaid ? 'text-slate-800' : 'text-orange-600'}`}>
                  ฿{amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
                </div>
              )}
            </div>
                       <Modal
                    title={
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                        <span className="text-lg font-bold text-slate-800">Bill Detail</span>
                      </div>
                    }
                    open={BillOpen}
                    onCancel={() => setBillOpen(false)}
                    footer={null}
                    width={700}
                  >
                    {isDetailLoading ? (
                      <div className="py-20 text-center"><Spin size="large" /></div>
                    ) : selectedStats ? (
                      <div className="space-y-4">
                        {/* --- ส่วนกล่องสถิติด้านบน 3 กล่อง --- */}
                        <div className="flex gap-4">
                          {/* ... (โค้ดกล่อง Total Trades, Win Rate, Profit ของคุณเหมือนเดิม) ... */}
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
                                ? 'bg-green-100 border-green-200' 
                                : 'bg-red-50 border-red-200' 
                            }`}
                          >
                            <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                              Number(selectedStats.filtered_profit) >= 0 ? 'text-green-600' : 'text-red-500'
                            }`}>
                              Profit
                            </p>
                            <p className={`text-2xl font-black leading-none ${
                              Number(selectedStats.filtered_profit) >= 0 ? 'text-green-700' : 'text-red-600'
                            }`}>
                              {Number(selectedStats.filtered_profit) >= 0 ? '+' : ''}{selectedStats.filtered_profit}
                            </p>
                          </div>
                        </div>

                        {/* --- ส่วนตาราง Trade History --- */}
                        <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                          <Table 
                            columns={tradeColumns} 
                            dataSource={selectedStats.trade_markers}
                            rowKey="time" 
                            pagination={{ pageSize: 5 }} 
                            size="small" 
                            scroll={{ y: 300 }} 
                            className="m-0"
                          />
                        </div>

                        {/* ✨ --- ส่วนสรุปยอด (Summary) ด้านล่างตาราง --- ✨ */}
                        <div className="flex justify-end pt-4 pb-2">
                          <div className="w-full sm:w-1/2 lg:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                            
                            {/* Profit */}
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">Profit</span>
                              <span className={`font-bold ${Number(selectedStats.filtered_profit) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {Number(selectedStats.filtered_profit) >= 0 ? '+' : ''}
                                {Number(selectedStats.filtered_profit).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                              </span>
                            </div>

                            {/* Commission */}
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">Commission</span>
                              <span className="font-bold text-slate-700">
                                {/* สมมติว่าค่าคอมมิชชั่นอยู่ใน selectedStats.commission */}
                                {Number(platformselect?.model?.commission || 0)}%   
                              </span>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">ProfitxCommision</span>
                              <span className="font-bold text-slate-700">
                                {/* สมมติว่าค่าคอมมิชชั่นอยู่ใน selectedStats.commission */}
                                {Number(selectedStats.filtered_profit)} x {Number(platformselect?.model?.commission/100 ||0)} = {Number(selectedStats.filtered_profit)*Number(platformselect?.model?.commission/100 ||0)}
                              </span>
                            </div>

                            <div className="border-t border-slate-200 my-2"></div>

                            {/* Total Amount */}
                            <div className="flex justify-between items-center">
                              <span className="text-slate-800 font-bold uppercase tracking-wide text-sm">Total Amount</span>
                              <span className="text-xl font-black text-blue-600">
                                {/* สมมติว่ายอดรวมอยู่ใน selectedStats.total_amount หรือคุณบวก/ลบเอาเองตรงนี้ได้เลย */}
                                {Number(selectedStats.total_amount || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                              </span>
                            </div>

                          </div>
                        </div>
                        {platformselect?.bill?.isPaid === false && (
                            <Button
                              type="primary"
                              size="large"
                              icon={<DollarOutlined />}
                              onClick={() => handleBill(selectedStats.licensekey)}
                              className="w-full mt-2 rounded-xl shadow-md flex items-center justify-center font-bold border-none"
                              style={{ 
                                backgroundColor: '#2b0b9e', 
                                color: 'white',
                                height: '48px' // ปรับให้ปุ่มสูงขึ้น กดง่ายๆ
                              }} 
                            >
                              ชำระเงินทันที
                            </Button>
                          )}

                            {/* ถ้าจ่ายแล้ว โชว์เป็นป้ายกำกับแทน */}
                            {platformselect?.bill?.isPaid && (
                                  <div 
                                    className="w-full mt-2 py-3 px-4 text-sm font-bold rounded-xl border flex items-center justify-center gap-2"
                                    // 2. ยัดสไตล์สีเขียวลงไปตรงๆ ป้องกัน CSS ตีกัน
                                    style={{
                                      backgroundColor: '#f0fdf4', // สี bg-green-50
                                      borderColor: '#bbf7d0',     // สี border-green-200
                                      color: '#16a34a'            // สี text-green-600
                                    }}
                                  >
                 
                                    ชำระเงินเรียบร้อยแล้ว
                                  </div>
                                )}
                        {/* ✨ --- จบส่วนสรุปยอด --- ✨ */}

                      </div>
                    ) : <Empty description="No Data" />}
</Modal>
          </div>
        </main>
      </div>
    </div>
  )
}