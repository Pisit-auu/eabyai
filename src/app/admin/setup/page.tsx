'use client'
import SidebarItem from "@/app/component/sidebar"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/app/component/headeradmin"
import axios from 'axios';
import { Table, message, Tag, Radio, Card, Button, Modal, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function SetupPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession()

  const [activeTab, setActiveTab] = useState<'PLATFORM' | 'SYMBOL' | 'TIMEFRAME'>('PLATFORM')
  const [symbols, setSymbols] = useState([])
  const [timeframes, setTimeframes] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // สำหรับการ Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editValue, setEditValue] = useState("")

  const [inputValue, setInputValue] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [resSym, resTf, resPlat] = await Promise.all([
        axios.get('/api/symbol'),
        axios.get('/api/timeframe'),
        axios.get('/api/platform')
      ])
      setSymbols(resSym.data)
      setTimeframes(resTf.data)
      setPlatforms(resPlat.data)
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลได้")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') fetchData()
  }, [status, fetchData])

  // --- ฟังก์ชันลบข้อมูล ---
  const handleDelete = async (record: any) => {
    try {
      let endpoint = ""
      // เลือกค่าที่จะส่งตาม Active Tab
      const nameToDelete = activeTab === 'PLATFORM' ? record.nameplatform : 
                           activeTab === 'SYMBOL' ? record.nameSymbol : record.nametimeframe

      if (activeTab === 'PLATFORM') endpoint = `/api/platform/${nameToDelete}`
      else if (activeTab === 'SYMBOL') endpoint = `/api/symbol/${nameToDelete}`
      else if (activeTab === 'TIMEFRAME') endpoint = `/api/timeframe/${nameToDelete}`

      await axios.delete(endpoint)
      message.success(`ลบ ${nameToDelete} สำเร็จ`)
      fetchData()
    } catch (error) {
      message.error("ไม่สามารถลบข้อมูลได้")
    }
  }

  // --- ฟังก์ชันเปิด Modal แก้ไข ---
  const showEditModal = (item: any) => {
    setEditingItem(item)
    // ดึงค่าตาม Key ของแต่ละ Tab
    const currentValue = activeTab === 'PLATFORM' ? item.nameplatform : 
                         activeTab === 'SYMBOL' ? item.nameSymbol : item.nametimeframe
    setEditValue(currentValue)
    setIsEditModalOpen(true)
  }

  // --- ฟังก์ชันบันทึกการแก้ไข ---
  const handleEditSave = async () => {
    try {
      let endpoint = ""
      let payload = {}
      
      // ดึงค่า "ชื่อเดิม" จาก editingItem ที่เราเก็บไว้ตอนกดปุ่ม Edit
      if (activeTab === 'PLATFORM') {
        endpoint = `/api/platform/${editingItem.nameplatform}`;
        payload = { 
          nameplatform: editValue 
        };
        
      } else if (activeTab === 'SYMBOL') {
        endpoint = `/api/symbol/${editingItem.nameSymbol}`;
        payload = { 
          nameSymbol: editValue 
        };
      } else if (activeTab === 'TIMEFRAME') {
        endpoint = `/api/timeframe/${editingItem.nametimeframe}`;
         payload = { 
          nametimeframe: editValue 
        };
      }

      
      await axios.put(endpoint, payload)
      message.success("แก้ไขข้อมูลเรียบร้อย")
      setIsEditModalOpen(false)
      fetchData()
    } catch (error) {
      message.error("แก้ไขไม่สำเร็จ")
    }
  }

  const columns = [
    {
      title: 'ชื่อรายการ',
      dataIndex: activeTab === 'PLATFORM' ? 'nameplatform' : activeTab === 'SYMBOL' ? 'nameSymbol' : 'nametimeframe',
      key: 'name',
      render: (text: string) => <Tag color="blue" className="px-4 py-1 text-sm font-medium">{text}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
            className="border-blue-500 text-blue-500 hover:text-blue-600"
          />
          
          <Popconfirm
            title="ยืนยันการลบ"
            description={`คุณต้องการลบ "${activeTab === 'PLATFORM' ? record.nameplatform : activeTab === 'SYMBOL' ? record.nameSymbol : record.nametimeframe}" ใช่หรือไม่?`}
            onConfirm={() => handleDelete(record)}
            okText="ใช่"
            cancelText="ไม่"
            okButtonProps={{ danger: true }}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </div>
      ),
    }
  ]

  // ... (ส่วน handleAddData และ getTableData เหมือนเดิม) ...
  const handleAddData = async () => {
    if (!inputValue) return message.warning("กรุณากรอกข้อมูล")
    setIsAdding(true)
    try {
      let endpoint = ""
      let payload = {}
      if (activeTab === 'PLATFORM') { endpoint = '/api/platform'; payload = { nameplatform: inputValue }; }
      else if (activeTab === 'SYMBOL') { endpoint = '/api/symbol'; payload = { nameSymbol: inputValue }; }
      else if (activeTab === 'TIMEFRAME') { endpoint = '/api/timeframe'; payload = { nametimeframe: inputValue }; }
      await axios.post(endpoint, payload)
      message.success(`เพิ่ม ${activeTab} สำเร็จ`)
      setInputValue("")
      fetchData()
    } catch (error) {
      message.error("ข้อมูลนี้มีอยู่แล้วในระบบ")
    } finally { setIsAdding(false) }
  }

  const getTableData = () => {
    if (activeTab === 'PLATFORM') return platforms
    if (activeTab === 'SYMBOL') return symbols
    return timeframes
  }

  return (
  <div className="min-h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-900">
    {/* Navbar */}
    <Navbar 
      isSidebarOpen={isSidebarOpen} 
      setSidebarOpen={setSidebarOpen} 
      handleLogout={() => signOut({ callbackUrl: '/' })} 
    />

    <div className="flex flex-1 overflow-hidden h-full">
      {/* Sidebar */}
      <aside className={`bg-[#1E293B] transition-all duration-300 shadow-xl z-20 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className={`w-64 flex flex-col py-6 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <SidebarItem label="Setup" href="/admin/setup" />
          <SidebarItem label="Expert Advisor" href="/admin/EA" />
          <SidebarItem label="Billing" href="/admin/Bill" />
        </div>
      </aside>

      {/* Main Content Area: ปรับให้เต็มจอ */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
        
        {/* ขยาย max-w-4xl เป็น max-w-full เพื่อให้เต็มพื้นที่หน้าจอ */}
        <div className="max-w-full mx-auto space-y-6">
          
          {/* 1. Header Section */}
          <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-200 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">ระบบจัดการข้อมูลพื้นฐาน</h2>
            <div className="mt-6">
              <Radio.Group 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)} 
                buttonStyle="solid" 
                size="large"
                className="shadow-sm rounded-lg overflow-hidden"
              >
                <Radio.Button value="PLATFORM" className="px-6">Platform</Radio.Button>
                <Radio.Button value="SYMBOL" className="px-6">Symbol</Radio.Button>
                <Radio.Button value="TIMEFRAME" className="px-6">Timeframe</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          {/* 2. Data Management Card: ปรับให้กว้างเต็มพิกัด */}
          <Card className="rounded-[2rem] shadow-sm border-slate-200 overflow-hidden min-h-[500px]">
            <div className="flex flex-col gap-6">
              
              {/* ฟอร์มเพิ่มข้อมูล */}
              <div className="border-b border-slate-100 pb-8 p-2">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  จัดการข้อมูล {activeTab}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    className="flex-1 px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all text-lg bg-slate-50/50"
                    placeholder={`ระบุชื่อ ${activeTab} ที่ต้องการเพิ่ม...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Button 
                    type="primary" 
                    onClick={handleAddData} 
                    loading={isAdding}
                    className="bg-blue-600 rounded-2xl h-auto px-10 text-lg font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] transition-transform"
                  >
                    เพิ่มข้อมูล
                  </Button>
                </div>
              </div>

              {/* ส่วนตาราง: ปรับให้แสดงข้อมูลได้กว้างขึ้น */}
              <div className="overflow-x-auto">
                <Table 
                  dataSource={getTableData()} 
                  columns={columns} 
                  loading={isLoading}
                  rowKey="id"
                  pagination={{ 
                    pageSize: 10,
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
      {/* --- Modal สำหรับแก้ไขข้อมูล --- */}
      <Modal
        title={`แก้ไขข้อมูล ${activeTab}`}
        open={isEditModalOpen}
        onOk={handleEditSave}
        onCancel={() => setIsEditModalOpen(false)}
        okText="บันทึก"
        cancelText="ยกเลิก"
        centered
      >
        <div className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อใหม่:</label>
          <Input 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)} 
            placeholder="กรอกชื่อที่ต้องการแก้ไข"
          />
        </div>
      </Modal>
    </div>
  )
}