'use client'

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

import SidebarItem from "@/app/component/sidebar"
import Navbar from "@/app/component/header"
import axios from 'axios';
import { Avatar, message, Spin, Tag } from 'antd';
import { 
  UserOutlined, 
  MailOutlined,
  IdcardOutlined,
  SaveOutlined,
  UploadOutlined,
  PictureOutlined
} from '@ant-design/icons';

export default function UserProfilePage() {
  // --- STATE ---
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  // User Data State
  const [name, setName] = useState("")
  const [image, setImage] = useState("") // ใช้ตัวนี้ตัวเดียว ทั้งเก็บข้อมูลและอัปโหลด
  const [userData, setUserData] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)

  const router = useRouter()
  const { data: session, status } = useSession()

  // --- ACTIONS ---
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // ฟังก์ชันดึงข้อมูล User จาก Database
  const fetchUserData = useCallback(async () => {
    if (!session?.user?.email) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/user/${session.user.email}`);
      const user = response.data;
      setUserData(user[0]);
      setName(user[0]?.name || "");
      setImage(user[0]?.image || "");

    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("ไม่สามารถดึงข้อมูลผู้ใช้งานได้");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, fetchUserData]);

  // --- HANDLERS ---
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // ฟังก์ชันอัพโหลด รูปภาพ
  const handleUpload = async () => {
    if (!file) {
      message.warning('กรุณาเลือกไฟล์รูปภาพก่อน');
      return;
    }
  
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const res = await axios.post('/api/uploadimg', formData);
  
      if (res.data?.url) {
        setImage(res.data.url); // อัปเดต State image ให้โชว์รูปทันที
        message.success('อัปโหลดรูปภาพชั่วคราวสำเร็จ กรุณากดบันทึกข้อมูล');
        setFile(null); // เคลียร์ไฟล์หลังจากอัปโหลดเสร็จ
      } else {
        message.error('ไม่พบ URL ของรูปภาพจากเซิร์ฟเวอร์');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      message.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!session?.user?.email) return;

    setIsSubmitting(true);
    try {
      await axios.put(`/api/user/${session.user.email}`, { 
        email: session.user.email,
        name: name,
        image: image // ส่ง URL รูปภาพไปอัปเดต
      });
      
      message.success("อัปเดตโปรไฟล์สำเร็จ");
      fetchUserData(); // ดึงข้อมูลใหม่มาแสดง
      
    } catch (error) {
      console.error("Update Error:", error);
      message.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
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
        isAdmin={session?.user.role === 'admin'}
        userImage={userData?.image || session?.user?.image}
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
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth flex justify-center items-start">
          <div className="w-full max-w-3xl space-y-6 mt-4">
            
            {/* Header Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
              <p className="text-slate-500 text-sm mt-1">
                จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ
              </p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200 gap-4">
                    <Spin size="large" />
                    <span className="text-slate-500 text-sm font-medium">กำลังโหลดข้อมูล...</span>
                </div>
                ) : (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                
                {/* 1. Avatar & Upload Section (ปรับปรุงใหม่) */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 mb-8 bg-slate-50 border border-slate-200 rounded-xl">
                  
                  {/* Avatar Display */}
                  <div className="relative shrink-0">
                    <Avatar 
                      size={100} 
                      src={image || undefined} 
                      icon={<UserOutlined />} 
                      className="shadow-md border-4 border-white"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                      <Tag color={userData?.role === 'admin' ? 'purple' : 'blue'} className="m-0 px-3 py-0.5 text-xs font-bold uppercase rounded-full shadow-sm">
                        {userData?.role || 'USER'}
                      </Tag>
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex flex-col items-center sm:items-start flex-1 w-full mt-4 sm:mt-0">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">เปลี่ยนรูปโปรไฟล์</h3>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 w-full">
                      {/* ปุ่มเลือกไฟล์ซ่อน input ไว้ข้างใน */}
                      <label className={`cursor-pointer px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <PictureOutlined /> เลือกไฟล์รูปภาพ
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setFile(e.target.files[0]);
                            }
                          }}
                        />
                      </label>

                      {/* แสดงชื่อไฟล์ที่เลือก */}
                      {file && (
                        <span className="text-sm text-slate-500 truncate max-w-[150px]">
                          {file.name}
                        </span>
                      )}

                      {/* ปุ่มอัปโหลด จะโชว์ต่อเมื่อมีการเลือกไฟล์แล้วเท่านั้น */}
                      {file && (
                        <button
                          type="button"
                          onClick={handleUpload}
                          disabled={isUploading}
                          className="px-4 py-2 bg-indigo-600 text-black text-sm rounded-lg hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2"
                        >
                          {isUploading ? <Spin size="small" /> : <UploadOutlined />} 
                          {isUploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูป'}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center sm:text-left">
                      รองรับไฟล์ .jpg, .png
                    </p>
                  </div>
                </div>

                {/* 2. Personal Info Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Email (Read Only) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-600 pl-1 flex items-center gap-2">
                      <MailOutlined /> Email Address
                    </label>
                    <input 
                      type="text" 
                      value={userData?.email || session?.user?.email || ""}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-600 pl-1 flex items-center gap-2">
                      <IdcardOutlined /> Display Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="กรอกชื่อของคุณ" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>

                </div>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={handleUpdateProfile} 
                    disabled={isSubmitting}
                    className={`px-6 py-2.5 rounded-lg font-semibold text-white transition-all shadow-md flex items-center gap-2
                      ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'}
                    `}
                  >
                    {isSubmitting ? <Spin size="small" /> : <SaveOutlined />} 
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                  </button>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}