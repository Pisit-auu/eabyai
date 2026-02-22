'use client'
import SidebarItem from "@/app/component/sidebar"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/app/component/header"
import axios from 'axios';
import { Table, message, Tag, Card, Button, Modal, Empty, Popconfirm , Spin} from 'antd';
import { EditOutlined,SearchOutlined , DollarOutlined } from '@ant-design/icons';

export default function BillingDashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [bills, setBills] = useState<BillType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [billselect, setbillselect] = useState<any>(null);
  const [selectedStats, setSelectedStats] = useState<any>(null);
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
  const [rateTHBtoUSD, setRate] = useState<number | 0>(0);


useEffect(() => {
    const fetchRate = async () => {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();

    setRate(data?.rates?.THB);
  };

  fetchRate();
}, []);

  const showEditModal = async (record: any) => {

    setbillselect(record)
    setIsDetailLoading(true);
    setIsEditModalOpen(true)
      try {

        if(!record?.license?.tradeAccount?.Server) {return;
        }

        const res = await axios.post("/api/account/details", {
          accountId: parseInt(record.license.tradeAccount.platformAccountId),
          investorPassword: record.license.tradeAccount.InvestorPassword , // ต้องมั่นใจว่ามีฟิลด์นี้
          server: record.license.tradeAccount.Server,
          symbol: record.license.model.nameSymbol
        });
        console.log(res.data)

        setSelectedStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsDetailLoading(false);
      }
    };
     const [userData, setUserData] = useState<any>(null)
     const [Paid, setPaid] = useState(0)
     const [unPaid, setunPaid] = useState(0)
     const [unPaidnotExpired, setunPaidnotExpired] = useState(0)
     const [totalProfit, settotalProfit] = useState(0)
   const fetchData = useCallback(async () => {
    // 1. Guard Clause: ดักเช็คอีเมลตั้งแต่บรรทัดแรก ถ้าไม่มีให้หยุดทันที ไม่ต้องโหลดอะไรเลย
    if (!session?.user?.email) return;

    setIsLoading(true);
    try {
      // 2. จับ API ทั้ง 2 เส้น ยิงขนานกันด้วย Promise.all ประหยัดเวลา
      const [resBill, resUser] = await Promise.all([
        axios.get('/api/bill'),
        axios.get(`/api/user/${session.user.email}`)
      ]);

      // 3. ป้องกัน Error จาก filter/reduce: เผื่อ API พังแล้วไม่ได้คืนค่า Array กลับมา (ใส่ || [] ดักไว้)
      const bills: BillType[] = resBill.data || [];
      console.log("Fetched Bills:", bills);

      // คำนวณค่าสถานะต่างๆ ของบิล
      const paidCount = bills.filter(b => b.isPaid).length;
      const unpaidExpiredCount = bills.filter(b => !b.isPaid && b.expire).length;
      const unpaidnotExpiredCount = bills.filter(b => !b.isPaid && !b.expire).length;
      
      const totalProfit = bills.reduce(
        (sum, b) => sum + (b.profit > 0 ? b.profit : 0), 0
      );

      // 4. เซ็ต State ทั้งหมดพร้อมกัน
      setBills(bills);
      setPaid(paidCount);
      setunPaid(unpaidExpiredCount);
      setunPaidnotExpired(unpaidnotExpiredCount);
      settotalProfit(totalProfit);
      
      // เซ็ตข้อมูล User
      setUserData(resUser.data[0]);

    } catch (error) {
      console.error("Fetch Bill Data Error:", error);
      message.error("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setIsLoading(false);
    }
  // 5. ⚠️ สำคัญมาก: เติม Dependency Array ให้ครบ ไม่งั้นฟังก์ชันจะจำค่าอีเมลว่างเปล่า
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, fetchData]);

    // --- ฟังก์ชันลบข้อมูล ---
    const handleDelete = async (record: any) => {
      try {
        // await axios.delete(`/api/bill/${record.id}`)
        message.success(`ลบบิล ID: ${record.id} สำเร็จ`)
        fetchData() // รีเฟรชข้อมูลหลังลบ
      } catch (error) {
        message.error("ไม่สามารถลบข้อมูลได้")
      }
      setIsEditModalOpen(true)
    }



  // --- กำหนดคอลัมน์ของตารางให้ตรงกับโครงสร้างข้อมูล JSON ---
  const columns = [
    {
      title: 'บิล ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => <Tag color="blue" className="px-4 py-1 text-sm font-medium">#{id}</Tag>,
      width: 100,
    },
    {
      title: 'ข้อมูลลูกค้า (Email / ชื่อ)',
      key: 'customer',
      render: (_: any, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700">{record.license?.tradeAccount?.fullname || 'ไม่มีชื่อ'}</span>
          <span className="text-xs text-slate-500">{record.email}</span>
        </div>
      )
    },
    {
      title: 'EA & Symbol',
      key: 'ea_model',
      render: (_: any, record: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-blue-600">{record.license?.model?.nameEA || '-'}</span>
          <span className="text-xs text-slate-500">
            {record.license?.model?.nameSymbol || '-'} ({record.license?.model?.timeframeName || '-'})
          </span>
        </div>
      )
    },
    {
      title: 'บัญชีเทรด',
      key: 'trade_account',
      render: (_: any, record: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.license?.tradeAccount?.PlatformName || '-'} / Lev: {record.license?.tradeAccount?.Leverage || '-'}</span>
          <span className="text-xs text-slate-500">{record.license?.tradeAccount?.Server || '-'}</span>
        </div>
      )
    },
    {
      title: 'สถานะการชำระเงิน',
      key: 'isPaid',
      render: (_: any, record: any) => (
        record.isPaid 
          ? <Tag color="success">ชำระแล้ว</Tag> 
          : <Tag color="warning">รอชำระเงิน</Tag>
      ),
      align: 'center' as const,
    },
    {
      title: 'สถานะ License',
      key: 'expire',
      render: (_: any, record: any) => (
        record.expire 
          ? <Tag color="error">หมดอายุ</Tag> 
          : <Tag color="processing">ใช้งานได้</Tag>
      ),
      align: 'center' as const,
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      render: (profit: number) => (
        <span className={`font-bold ${profit > 0 ? 'text-green-600' : profit < 0 ? 'text-red-600' : 'text-slate-500'}`}>
          ${profit?.toFixed(2) || '0.00'}
        </span>
      ),
      align: 'right' as const,
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <div className="flex gap-2 justify-center">
          <Button 
            icon={<SearchOutlined  />} 
            onClick={() => showEditModal(record)}
            size="small"
            className="border-blue-500 text-blue-500 hover:text-blue-600"
          />
          <Popconfirm
            title="ยืนยันการลบ"
            description={`คุณต้องการลบบิล ID: ${record.id} ใช่หรือไม่?`}
            onConfirm={() => handleDelete(record)}
            okText="ใช่"
            cancelText="ไม่"
            okButtonProps={{ danger: true }}
          >
            {/* <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            /> */}
          </Popconfirm>
        </div>
      ),
    }
  ]

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <Navbar 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        handleLogout={() => signOut({ callbackUrl: '/' })} 
        isAdmin={session?.user.role ==='admin'}
        userImage={userData?.image }
      />

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <aside className={`bg-[#1E293B] transition-all duration-300 shadow-xl z-20 flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
          <div className={`w-64 flex flex-col py-6 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 overflow-hidden'}`}>
            <SidebarItem label="Setup" href="/admin/setup" />
            <SidebarItem label="Expert Advisor" href="/admin/EA" />
            <SidebarItem label="Billing" href="/admin/Bill" />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-full mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">ระบบจัดการบิล (Billing)</h2>
                <Tag
                    color="cyan"
                    className="px-3 py-1"
                    style={{ fontSize: "20px", fontWeight: 400 }}
                  >
                    จำนวนบิลทั้งหมด: {bills.length}
                  </Tag>
              </div>
            </div>
             <div className="flex gap-4">
                          {/* ... (โค้ดกล่อง Total Trades, Win Rate, Profit ของคุณเหมือนเดิม) ... */}
                          <div className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <p className="text-blue-500 text-[11px] font-bold uppercase tracking-wider mb-1">ชำระแล้ว</p>
                            <p className="text-2xl font-black text-blue-700 leading-none">
                              {Paid}
                            </p>
                          </div>

                          <div className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">ยังไม่ชำระ</p>
                            <p className="text-2xl font-black text-slate-800 leading-none">
                              {unPaid}
                            </p>
                          </div>
                          <div className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">ยังไม่ถึงกำหนดชำระ</p>
                            <p className="text-2xl font-black text-slate-800 leading-none">
                              {unPaidnotExpired}
                            </p>
                          </div>
                          <div className={`flex-1 p-4 border rounded-2xl shadow-sm ${
                             0
                            }`}
                          >
                            <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                              Number(selectedStats?.filtered_profit) >= 0 ? 'text-blue-600' : 'text-red-500'
                            }`}>
                              ที่ต้องได้รับทั้งหมด
                            </p>
                            <p className={`text-2xl font-black leading-none ${
                              Number(totalProfit) >= 0 ? 'text-blue-700' : 'text-red-600'
                            }`}>
                              {(totalProfit* rateTHBtoUSD ).toFixed(2)} THB
                            </p>
                          </div>
                        </div>
            {/* Data Management Card */}
            <Card className="rounded-[2rem] shadow-sm border-slate-200 overflow-hidden min-h-[500px]">
              <div className="flex flex-col gap-6">
                <div className="overflow-x-auto">
                  <Table 
                    dataSource={bills} 
                    columns={columns} 
                    loading={isLoading}
                    rowKey="id"
                    pagination={{ 
                      pageSize: 7,
                      className: "px-4" 
                    }}
                    className="custom-table"
                  />
                </div>
              </div>
            </Card>

          </div>
        </main>
      </div>

              <Modal title={
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-7 bg-blue-600 rounded-full" />
                        <div className="flex flex-col justify-center"> 
                          <span className="text-lg font-bold text-slate-800 leading-none">Bill Detail</span> 
                            <div className="flex gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">
                             Status
                            </span>
                            <span className="text-[11px] text-blue-500">:</span>
                           <span
                            className="text-[11px] font-semibold uppercase tracking-wider"
                            style={{
                              color: !billselect?.expire
                                ? "#64748b" // เทา (ยังไม่ถึงเวลา)
                                : billselect?.isPaid
                                ? "#16a34a" // เขียว
                                : "#dc2626" // แดง
                            }}
                          >
                            {!billselect?.expire
                              ? "ยังไม่ถึงเวลาจ่าย"
                              : billselect?.isPaid
                              ? "ชำระแล้ว"
                              : "รอชำระเงิน"}
                          </span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">
                              {new Date(billselect?.createdAt).toLocaleDateString('en-GB')}
                            </span>
                            <span className="text-[11px] text-blue-500">—</span>
                            <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">
                              {new Date(billselect?.exirelicendate).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                    open={isEditModalOpen}
                    onCancel={() => setIsEditModalOpen(false)}
                    footer={null}
                    width={700}
                  >
                    {isDetailLoading ? (
                      <div className="py-20 text-center"><Spin size="large" /></div>
                    ) : selectedStats ? (
                      <div className="space-y-4">
                        {/* --- ส่วนกล่องสถิติด้านบน 3 กล่อง --- */}
      
                          
                          
                        {/* --- ส่วนตาราง Trade History --- */}
                        <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                          <Table 
                            columns={tradeColumns} 
                            dataSource={selectedStats.trade_markers}
                            rowKey="time" 
                            pagination={{ pageSize: 4 }} 
                            size="small" 
                            scroll={{ y: 300 }} 
                            className="m-0"
                          />
                        </div>

                        {/* ✨ --- ส่วนสรุปยอด (Summary) ด้านล่างตาราง --- ✨ */}
                          <div className="flex justify-end  pb-2">
                          <div className="w-full sm:w-1/2 lg:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                             <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">Email</span>
                              <span className={`font-bold`}>
                                  {billselect?.email}
                              </span>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">Full Name</span>
                              <span className={`font-bold`}>
                                  {billselect?.license?.tradeAccount?.fullname}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">Platform</span>
                              <span className={`font-bold`}>
                                  {billselect?.license?.tradeAccount?.PlatformName}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">Trader Id</span>
                              <span className={`font-bold`}>
                                  {billselect?.license?.tradeAccount?.platformAccountId}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium"> Server</span>
                              <span className={`font-bold`}>
                                  {billselect?.license?.tradeAccount?.Server}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium"> Licensekey</span>
                              <span className={`font-bold`}>
                                  {billselect?.license?.licensekey}
                              </span>
                            </div>
                  
                          </div>
                        </div>


                        <div className="flex justify-end  pb-2">
                          <div className="w-full sm:w-1/2 lg:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                            
                            {/* Profit */}
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">Profit</span>
                              <span className={`font-bold ${Number(billselect?.profit) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {Number(billselect?.profit) >= 0 ? '+' : ''}
                                {Number(billselect?.profit).toLocaleString('th-TH', { minimumFractionDigits: 2 })} USD
                              </span>
                            </div>

                            {/* Commission */}
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">Commission</span>
                              <span className="font-bold text-slate-700">
                                {/* สมมติว่าค่าคอมมิชชั่นอยู่ใน selectedStats.commission */}
                                {Number(billselect?.license?.model?.commission || 0)}%   
                              </span>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">ProfitxCommision</span>
                              <span className="font-bold text-slate-700">
                                {/* สมมติว่าค่าคอมมิชชั่นอยู่ใน selectedStats.commission */}
                                {Number(billselect?.profit)} x {Number(billselect?.commission/100 ||0)} = {(Number(billselect?.profit)*Number(billselect?.commission/100 ||0)).toFixed(3)} USD
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500 font-medium">USD to THB </span>
                              <span className="font-bold text-slate-700">
                                {/* สมมติว่าค่าคอมมิชชั่นอยู่ใน selectedStats.commission */}
                               {(Number(billselect?.profit)*Number(billselect?.commission/100 ||0)* rateTHBtoUSD).toFixed(3)} THB
                              </span>
                            </div>

                            <div className="border-t border-slate-200 my-2"></div>

                            {/* Total Amount */}
                            <div className="flex justify-between items-center">
                              <span className="text-slate-800 font-bold uppercase tracking-wide text-sm">Total Amount</span>
                              <span className="text-xl font-black text-blue-600">
                                {/* สมมติว่ายอดรวมอยู่ใน selectedStats.total_amount หรือคุณบวก/ลบเอาเองตรงนี้ได้เลย */}
                                {(Number(billselect?.profit)*Number(billselect?.commission/100 ||0)* rateTHBtoUSD).toFixed(3)} THB
                              </span>
                            </div>

                          </div>
                        </div>
                      </div>
                    ) : <Empty description="No Data" />}
                      </Modal>
        
    </div>
  )
}