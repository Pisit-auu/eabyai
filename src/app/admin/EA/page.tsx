'use client'
import SidebarItem from "@/app/component/sidebar"
import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { useRouter,usePathname } from "next/navigation"
import Navbar from "@/app/component/headeradmin"
import axios from 'axios';
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, CloudUploadOutlined, FileTextOutlined, 
  SaveOutlined 
} from '@ant-design/icons'
import { 
  Table, Button, Modal, Form, Input, Select, 
  InputNumber, Switch, Tag, Popconfirm, message, Space, Spin 
} from 'antd'
export default function Billpage() {
  const columns = [
    {
      title: 'EA Name',
      dataIndex: 'nameEA',
      key: 'nameEA',
      render: (text: string) => <span className="font-bold text-slate-700">{text}</span>
    },
    {
      title: 'Config',
      key: 'config',
      render: (_: any, record: ModelType) => (
        <div className="flex flex-wrap gap-1">
            <Tag color="blue">{record.nameSymbol}</Tag>
            <Tag color="cyan">{record.timeframeName}</Tag>
            <Tag color="purple">{record.PlatformName}</Tag>
        </div>
      )
    },
    {
      title: 'Commission ($)',
      dataIndex: 'commission',
      key: 'commission',
      render: (val: number) => val.toFixed(2)
    },

    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'error'}>
            {active ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ModelType) => (
        <Space>
            <Button 
                icon={<EditOutlined />} 
                onClick={() => handleEdit(record)} 
                size="small"
            />
            <Popconfirm 
                title={`ลบ ${record.nameEA} ?`}
                onConfirm={() => handleDelete(record.nameEA)}
                okButtonProps={{ danger: true }}
            >
                <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
        </Space>
      )
    }
  ]
 
  const [isSidebarOpen, setSidebarOpen] = useState(true) // ควบคุม Sidebar
  const [linkEA , setLinkEA ] = useState<LinkdownloadType[]>([])
  const [Model, setModel] = useState<ModelType[]>([])
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  
  const handleEdit = (record: ModelType) => {
    console.log(record)

  }
  const handleDeletelinkEA = async (id: String) => {
    try {
        await axios.delete(`/api/linkmodel/${id}`)
        message.success(`ลบ ${id} สำเร็จ` )
        fetchAllData();
    } catch (error) {
        message.error("เกิดข้อผิดพลาดในการลบ")
    }
  }
  const handleDelete = async (id: String) => {
    try {
        await axios.delete(`/api/model/${id}`)
        message.success(`ลบ ${id} สำเร็จ` )
        fetchAllData();
    } catch (error) {
        message.error("เกิดข้อผิดพลาดในการลบ")
    }
  }

  const fetchAllData = useCallback(async () => {
  setIsLoading(true);
  try {
      const [resModel, resSymbol, resTimeframe, resPlatform,reslinkmodel] = await Promise.all([
        axios.get('/api/model'),
        axios.get('/api/symbol'),
        axios.get('/api/timeframe'),
        axios.get('/api/platform'),
        axios.get('/api/linkmodel'),
      ]);
      console.log(reslinkmodel.data)
      setModel(resModel.data);
      setSymbolAll(resSymbol.data);
      setTimeframeAll(resTimeframe.data);
      setPlatformAll(resPlatform.data);
      setLinkEA(reslinkmodel.data)
    } catch (error) {
      console.error(error);
      message.error("ไม่สามารถดึงข้อมูลได้");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // เรียกใช้ครั้งเดียวตอน Mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAllData();
    }
  }, [fetchAllData, status]);

  // --- 2. การตรวจสอบสถานะ Login (รวมไว้ด้วยกัน) ---
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);
   
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }



  //add EA
  const [addnewModelOpen , setAddnewModelOpen ] = useState(false)
  const [addLinkEAOpen , setaddLinkEAOpen] = useState(false)
   const [SymbolAll, setSymbolAll] = useState<SymbolType[]>([])
    const [TimeframeAll, setTimeframeAll] = useState<TimeframeType[]>([])
    const [PlatformAll, setPlatformAll] = useState<PlatformType[]>([])
  
    //setEA
    const [Symbolselect, setSymbolselect] = useState<string | null>(null)
    const [Timeframeselect, setselectTimeframe] = useState<string | null>(null)
    const [Platformselect, setselectPlatform] = useState<string | null>(null)
    const [nameEA, setnameEA] = useState("") 
    const [Linkname, setLinkname] = useState("") 
    const [commission, setCommission] = useState<number>(0);
    const [filePath, setfilePath] =  useState("null")
    const handleModel = async () => {
      if(Symbolselect === ""){
        alert("please select symbol")
        return
      }
      if(Timeframeselect === ""){
        alert("please select Timeframe")
        return
      }
      if(Platformselect === ""){
        alert("please select Timeframe")
        return
      }
      if(nameEA === ""){
        alert("please input nameEA")
        return
      }
      if(commission === 0){
        alert("please input commission")
        return
      }

      try {
        await axios.post('/api/model', {
            nameEA: nameEA,
            symbol: Symbolselect,
            timeframe: Timeframeselect,
            filePath : filePath,
            platform : Platformselect,
            commission: commission
          })
        alert("เพิ่มเสร็จสิ้น")
      } catch (error) {
        console.log(error)
        alert('เกิดปัญหา มีอยู่แล้ว')
        fetchAllData();
      }
      setnameEA("") 
      setSymbolselect(null)
      setselectTimeframe(null)
      setselectPlatform(null)
      setCommission(0.1)
      fetchAllData();
  
    }
    const handleLinkmodel = async () => {
 
      if(Linkname === ""){
        alert("please input nameEA")
        return
      }
     
      if(filePath ==="null"){
        alert("please upload fileEA")
        return
      }
      try {
        if (linkEA.length ===0 ){
          await axios.post('/api/linkmodel', {
            namefile: Linkname,
            Pathname: filePath,
          })
        alert("เพิ่มเสร็จสิ้น")
        }else{
          await axios.put(`/api/linkmodel/${linkEA[0].namefile}`, {
            namefile: Linkname,
            Pathname: filePath, 
          })
        alert("อัพเดตเสร็จสิ้น")
        }
      } catch (error) {
        console.log(error)
        alert('เกิดปัญหา มีอยู่แล้ว')
      }
      setLinkname("") 
      setfilePath("null")
      setaddLinkEAOpen(false)
      fetchAllData();
    }
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

    //select symbol
    const onChangeSymbol = (value: string) => {
      console.log(`selected ${value}`);
      setSymbolselect(value)
    };
  
    const onSearch = (value: string) => {
      console.log('search:', value);
    };
       //select PLatform
    const onChangePlatform = (value: string) => {
      console.log(`selected ${value}`);
      setselectPlatform(value)
    };
  
     //select Timeframe
    const onChangeTimeframe = (value: string) => {
      console.log(`selected ${value}`);
      setselectTimeframe(value)
    };
  
  

   return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#1E293B]">
        {/* Navbar ขนาดใหญ่ (h-20) */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          handleLogout={handleLogout}
        />

        <div className="flex flex-1 overflow-hidden">
                      {/* Sidebar */}
                      <aside className={`bg-[#1E293B] transition-all duration-300 shadow-xl z-20 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
                        <div className={`w-64 flex flex-col py-6 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                                <SidebarItem label="Setup" href="/admin/setup" />
                                               <SidebarItem label="Expert Advisor" href="/admin/EA" />
                                               <SidebarItem label="Billing" href="/admin/Bill" />
                        </div>
                      </aside>
  
         {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50 flex flex-col">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 min-h-[600px] p-6 md:p-8 flex-1">
            
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Model EA Management</h1>
                        <p className="text-slate-500 text-sm mt-1">จัดการข้อมูล EA, ตั้งค่าราคา และสถานะ</p>
                    </div>
                    <div className="flex gap-2">
                        <Button icon={<ReloadOutlined />} 
                        onClick={fetchAllData} 
                        loading={isLoading}>Refresh</Button>
                        <Button type="primary" 
                        onClick={() => setAddnewModelOpen(true)}

                        className="bg-blue-600">
                            Add New Model
                        </Button>
                      
                  </div>
              </div>

          {addnewModelOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* ส่วนของ Overlay (พื้นหลังที่ทำให้จอมืดลงและเบลอ) */}
                    <div 
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                      onClick={() => setAddnewModelOpen(false)} // คลิกพื้นที่ว่างเพื่อปิด
                    ></div>

                    {/* ตัว Popup Card */}
                    <section className="relative bg-white/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                      
                      {/* ปุ่มปิดมุมขวาบน */}
                      <button 
                        onClick={() => setAddnewModelOpen(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>

                      <div className="mb-6 sm:mb-8 border-b border-slate-200/50 pb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">สร้าง Model ใหม่</h2>
                        <p className="text-slate-500 text-sm">ระบุรายละเอียดและอัปโหลดไฟล์ (.ex5 หรือ .zip) เพื่อเพิ่ม EA เข้าสู่ระบบ</p>
                      </div>

                      {/* Grid Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                        
                        {/* Symbol */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-slate-700">Symbol</label>
                          <Select
                            className="w-full h-[45px] sm:h-[50px] custom-select-glass" 
                            size="large"
                            showSearch={{ optionFilterProp: 'label' }}
                            placeholder="Select a Symbol"
                            onChange={onChangeSymbol}
                            options={SymbolAll.map((item) => ({
                              value: item.nameSymbol,
                              label: item.nameSymbol,
                            }))}
                          />
                        </div>

                        {/* Timeframe */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-slate-700">Timeframe</label>
                          <Select
                            className="w-full h-[45px] sm:h-[50px]"
                            size="large"
                            placeholder="Select a Timeframe"
                            onChange={onChangeTimeframe}
                            options={TimeframeAll.map((item) => ({
                              value: item.nametimeframe,
                              label: item.nametimeframe,
                            }))}
                          />
                        </div>

                        {/* Platform */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-slate-700">Platform</label>
                          <Select
                            className="w-full h-[45px] sm:h-[50px]"
                            size="large"
                            placeholder="Select a Platform"
                            onChange={onChangePlatform}
                            options={PlatformAll.map((item) => ({
                              value: item.nameplatform,
                              label: item.nameplatform,
                            }))}
                          />
                        </div>

                        {/* ชื่อ EA */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-slate-700">ชื่อ EA</label>
                          <input 
                            type="text" 
                            placeholder="ระบุชื่อ EA" 
                            value={nameEA}
                            onChange={(e) => setnameEA(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white/50"
                          />
                        </div>

                        {/* Commission */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-sm font-semibold text-slate-700">ค่า Commission</label>
                          <input 
                            type="number" 
                            min={0}
                            step={0.1}
                            placeholder="ระบุค่า Commission" 
                            value={commission || 0}
                            onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all bg-white/50"
                          />
                        </div>
                      </div>

            

                      {/* ปุ่ม Action */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <button 
                          onClick={() => setAddnewModelOpen(false)}
                          className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                        >
                          ยกเลิก
                        </button>
                        <button 
                          onClick={handleModel} 
                          disabled={!nameEA} 
                          className="flex-[2] bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-xl flex justify-center items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                          Create New EA
                        </button>
                      </div>
                    </section>
                  </div>
                )}
              {addLinkEAOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* ส่วนของ Overlay (พื้นหลังที่ทำให้จอมืดลงและเบลอ) */}
                    <div 
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                      onClick={() => setaddLinkEAOpen(false)} // คลิกพื้นที่ว่างเพื่อปิด
                    ></div>

                    {/* ตัว Popup Card */}
                    <section className="relative bg-white/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                      
                      {/* ปุ่มปิดมุมขวาบน */}
                      <button 
                        onClick={() => setaddLinkEAOpen(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>

                      <div className="mb-6 sm:mb-8 border-b border-slate-200/50 pb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">เพิ่ม หรือ อัพเดต Link Download EA </h2>
                        <p className="text-slate-500 text-sm">พิมพ์ชื่อ และอัปโหลดไฟล์ (.ex5 หรือ .zip) เพื่อเพิ่ม Link Download EA</p>
                      </div>

                      {/* Grid Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                        
                      
                        {/* ชื่อ EA */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-sm font-semibold text-slate-700">Link Name</label>
                          <input 
                            type="text" 
                            placeholder="ระบุชื่อ link" 
                            value={Linkname}
                            onChange={(e) => setLinkname(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white/50"
                          />
                        </div>

                       
                      </div>

                      {/* โซนอัปโหลดไฟล์ (Glassy Style) */}
                      <div className="bg-slate-50/50 p-6 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center">
                        <UploadButton<OurFileRouter, "eaUploader">
                          endpoint="eaUploader"
                          onClientUploadComplete={(res) => setfilePath(res[0].ufsUrl)}
                          content={{
                            button({ ready }) {
                              return <div className="text-white font-bold">{ready ? "เลือกไฟล์ EA" : "กำลังโหลด..."}</div>;
                            }
                          }}
                          appearance={{
                            button: "bg-blue-600 hover:bg-blue-700 rounded-xl px-8 py-3 transition-all shadow-lg shadow-blue-500/30",
                            container: "w-full",
                            allowedContent: "hidden" 
                          }}
                        />
                        
                        {filePath !== "null" && filePath !== "" && (
                          <div className="mt-4 px-4 py-2 bg-green-500/10 text-green-700 border border-green-200 rounded-lg text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            <span className="truncate">อัปโหลดเรียบร้อย: {filePath.split('/').pop()}</span>
                          </div>
                        )}
                      </div>

                      {/* ปุ่ม Action */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <button 
                          onClick={() => setaddLinkEAOpen(false)}
                          className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                        >
                          ยกเลิก
                        </button>
                        <button 
                          onClick={handleLinkmodel} 
                          disabled={filePath === "null" || !Linkname} 
                          className="flex-[2] bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-xl flex justify-center items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                          Add new Link
                        </button>
                      </div>
                    </section>
                  </div>
                )}
              
                      { linkEA.length === 0 ? (
                          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-100 pb-6">
                          <div>
                              <h1 className="text-2xl font-bold text-slate-800">Link Download EA ปัจจุบัน</h1>
                              <p className="text-slate-500 text-sm mt-1">ไม่มี Link EA</p>
                          </div>
                          <div className="flex gap-2">
      
                              <Button type="primary" 
                              onClick={() => setaddLinkEAOpen(true)}

                              className="bg-blue-600">
                                  Add Link EA
                              </Button>
                              
                          </div>
                        </div>
                        
                      ) : (
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-100 pb-6">
                          <div>
                              <h1 className="text-2xl font-bold text-slate-800">Link Download EA ปัจจุบัน</h1>
                              <p className="text-slate-500 text-sm mt-1">Name : {linkEA[0].namefile}</p>
                              <p className="text-slate-500 text-sm mt-1">Link : {linkEA[0].Pathname}</p>
                          </div>
                          <div className="flex gap-2">
                              <Button type="primary" 
                              onClick={() => setaddLinkEAOpen(true)}

                              className="bg-blue-600">
                                  Edit Link EA
                              </Button>
                               <Button 
                                onClick={handleDownloadEA}  className="!bg-green-500 hover:!bg-green-400 !border-none !text-white">
                                  Download EA
                              </Button>
                              <Popconfirm 
                                title={`ลบ ${linkEA[0].namefile} ?`}
                                onConfirm={() => handleDeletelinkEA(linkEA[0].namefile)}
                                okButtonProps={{ danger: true }}
                            >
                                <Button type="primary" 
                             danger >
                                  Delete Link EA
                              </Button>
                            </Popconfirm>

                          
                          </div>
                        </div>
                      )}
              {/* Table Section */}
              <Table 
                columns={columns} 
                dataSource={Model} 
                rowKey="id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />

            </div>
          </div>
        </main>
      </div>

     
    </div>
  )
}