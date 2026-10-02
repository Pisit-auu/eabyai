'use client'

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

import SidebarItem from "@/app/component/sidebar"
import Navbar from "@/app/component/header"
import axios from 'axios';
import { 
  Avatar, message, Spin, Tag, Card, Row, Col,Popconfirm,
  Statistic, Table, Button, Space, Modal, Select 
} from 'antd'; // เพิ่ม Modal และ Select
import { 
  UserOutlined, 
  TeamOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
  DeleteOutlined,
  WalletOutlined
} from '@ant-design/icons';

export default function AdminUserManagementPage() {
  // --- STATE ---
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [allUsers, setAllUsers] = useState<any[]>([]) 

  // --- MODAL STATE (สำหรับการแก้ไข Role) ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>('user');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isAccountsModalVisible, setIsAccountsModalVisible] = useState(false);
  const [selectedUserForAccounts, setSelectedUserForAccounts] = useState<any>(null);
  const router = useRouter()
  const { data: session, status } = useSession()

  // --- ACTIONS ---
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/user')
    }
  }, [status, session, router])

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/user'); 
      
      if (response.data && Array.isArray(response.data.userall)) {
        setAllUsers(response.data.userall);
      } else {
        console.warn("API ไม่ได้ส่ง userall กลับมาเป็น Array:", response.data);
        setAllUsers([]);
      }

    } catch (error) {
      console.error("Error fetching all users:", error);
      message.error("ไม่สามารถดึงข้อมูลผู้ใช้งานทั้งหมดได้");
      setAllUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
const openAccountsModal = (user: any) => {
    setSelectedUserForAccounts(user);
    setIsAccountsModalVisible(true);
  };

  // คอลัมน์สำหรับตารางย่อยใน Modal (เหมือนหน้า User Dashboard)
    const accountDetailsColumns = [
        {
        title: 'Platform',
        dataIndex: ['platform', 'nameplatform'],
        key: 'platform',
        render: (text: string) => <Tag color="blue">{text || 'MT5'}</Tag>,
        },
        {
        title: 'Account ID',
        dataIndex: 'platformAccountId',
        key: 'platformAccountId',
        render: (text: string) => <span className="font-semibold text-slate-700">{text}</span>,
        },
        {
        title: 'Server',
        dataIndex: 'Server',
        key: 'Server',
        },
        {
        title: 'Leverage',
        dataIndex: 'Leverage',
        key: 'Leverage',
        render: (text: string) => text ? `1:${text}` : '-',
        },
        {
        title: 'Status',
        key: 'status',
        render: (record: any) => (
            record.isDisconnected ? (
            <Tag color="red">Disconnected</Tag>
            ) : (
            <Tag color="green">Connected</Tag>
            )
        ),
        },
    ];
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchAllUsers();
    }
  }, [status, session, fetchAllUsers]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // --- HANDLERS FOR ROLE MANAGEMENT ---
  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role || 'user'); // ค่าเริ่มต้นเป็น role เดิมของ user
    setIsModalVisible(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    setIsUpdatingRole(true);
    try {
      // ส่ง Request ไปอัปเดตข้อมูล (ต้องแน่ใจว่า API /api/user/[email] ของคุณรองรับการรับค่า role ไปอัปเดตด้วย)
      await axios.put(`/api/user/${selectedUser.email}`, { 
        email: selectedUser.email,
        role: newRole 
      });
      
      message.success(`อัปเดตสิทธิ์ของ ${selectedUser.email} เป็น ${newRole.toUpperCase()} สำเร็จ`);
      setIsModalVisible(false);
      fetchAllUsers(); 
      
    } catch (error) {
      console.error("Update Role Error:", error);
      message.error("เกิดข้อผิดพลาดในการอัปเดตสิทธิ์");
    } finally {
      setIsUpdatingRole(false);
    }
  };
  const handledelete = async (id: string) => {
  try {
    if(id === session?.user.email){
        alert("ไม่สามารถลบตัวเองได้")
        return
    }
    await axios.delete(`/api/user/${id}`);

    message.success("ลบสำเร็จ");
  } catch (error) {
    console.error("Delete Error:", error);
    message.error("เกิดข้อผิดพลาดในการลบ");
  }
};
  // --- TABLE COLUMNS ---
  const userColumns = [
    {
      title: 'ผู้ใช้งาน',
      key: 'user',
      render: (record: any) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.image} icon={<UserOutlined />} />
          <div>
            <div className="font-semibold text-slate-700">{record.name || 'No Name'}</div>
            <div className="text-xs text-slate-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'สิทธิ์การใช้งาน',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'purple' : 'blue'} className="uppercase font-semibold">
          {role || 'USER'}
        </Tag>
      ),
    },
    {
      title: 'บัญชีเทรด',
      key: 'tradeAccounts',
      render: (record: any) => {
        const accountCount = record.tradeAccounts?.length || 0;
        return (
          // เพิ่ม onClick และเปลี่ยนสไตล์ให้ดูเหมือนปุ่ม/ลิงก์
          <div 
            className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 w-max px-3 py-1 rounded-md"
            onClick={() => openAccountsModal(record)}
          >
            <WalletOutlined />
            <span className="font-semibold underline underline-offset-2 decoration-dotted">
              {accountCount} บัญชี
            </span>
          </div>
        )
      },
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (record: any) => (
        <Space size="middle">
          {/* ✅ กดแล้วเปิด Modal */}
          <Button 
            type="text" 
            icon={<EditOutlined className="text-blue-500" />} 
            onClick={() => openEditModal(record)}
          >
            แก้ไข
          </Button>
          {/* <Popconfirm
            title="ยืนยันการลบ"
            description={`คุณต้องการลบ ${record.email} ใช่หรือไม่?`}
            okText="ลบ"
            cancelText="ยกเลิก"
            onConfirm={() => handledelete(record.email)}
            >
            <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
            >
                ลบ
            </Button>
            </Popconfirm> */}
        </Space>
      ),
    },
  ];

  // --- CALCULATE STATS ---
  const validUsers = Array.isArray(allUsers) ? allUsers : [];
  const totalUsers = validUsers.length;
  const adminCount = validUsers.filter(u => u?.role === 'admin').length;
  const totalTradeAccounts = validUsers.reduce((sum, user) => sum + (user?.tradeAccounts?.length || 0), 0);

  // --- RENDER ---
  return (
    <div className="h-screen bg-[#F1F5F9] flex flex-col font-sans text-slate-800 overflow-hidden">
      
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        isAdmin={true}
        userImage={session?.user?.image}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className={`bg-[#1E293B] transition-all duration-300 shadow-xl z-20 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
          <div className={`w-64 flex flex-col py-6 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
               <SidebarItem label="Setup" href="/admin/setup" />
                     <SidebarItem label="Expert Advisor" href="/admin/EA" />
                     <SidebarItem label="Billing" href="/admin/Bill" />
                     <SidebarItem label="user" href="/admin/user" />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="w-full max-w-7xl mx-auto space-y-6 mt-4">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <TeamOutlined className="text-blue-600" /> Users Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                จัดการข้อมูลผู้ใช้งานทั้งหมด กำหนดสิทธิ์ และตรวจสอบบัญชีเทรด
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200 gap-4">
                <Spin size="large" />
                <span className="text-slate-500 text-sm font-medium">กำลังโหลดข้อมูลผู้ใช้งาน...</span>
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Card className="rounded-2xl shadow-sm border-slate-200">
                      <Statistic 
                        title="ผู้ใช้งานทั้งหมด (Total Users)" 
                        value={totalUsers} 
                        prefix={<TeamOutlined className="text-blue-500 mr-2" />} 
                        styles={{ content: { color: '#1e293b', fontWeight: 'bold' } }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card className="rounded-2xl shadow-sm border-slate-200">
                      <Statistic 
                        title="ผู้ดูแลระบบ (Admins)" 
                        value={adminCount} 
                        prefix={<SafetyCertificateOutlined className="text-purple-500 mr-2" />} 
                        styles={{ content: { color: '#8b5cf6', fontWeight: 'bold' } }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card className="rounded-2xl shadow-sm border-slate-200">
                      <Statistic 
                        title="บัญชีเทรดในระบบ (Total Accounts)" 
                        value={totalTradeAccounts} 
                        prefix={<WalletOutlined className="text-emerald-500 mr-2" />} 
                        styles={{ content: { color: '#10b981', fontWeight: 'bold' } }}
                      />
                    </Card>
                  </Col>
                </Row>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800">รายชื่อผู้ใช้งานทั้งหมด</h2>
                  </div>
                  
                  <Table 
                    dataSource={validUsers} 
                    columns={userColumns} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }}
                    className="overflow-x-auto"
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800">
      
            จัดการสิทธิ์ผู้ใช้งาน (Role Management)
          </div>
        }
        open={isModalVisible}
        onOk={handleUpdateRole}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={isUpdatingRole}
        okText="บันทึกการเปลี่ยนแปลง"
        cancelText="ยกเลิก"
        okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700' }}
        centered
      >
        {selectedUser && (
          <div className="space-y-4 py-4">
            {/* โชว์ข้อมูล User ที่กำลังแก้ไข */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <Avatar src={selectedUser.image} icon={<UserOutlined />} />
              <div>
                <div className="font-semibold text-slate-700">{selectedUser.name || 'No Name'}</div>
                <div className="text-sm text-slate-500">{selectedUser.email}</div>
              </div>
            </div>

            {/* เลือก Role ใหม่ */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">เลือกระดับสิทธิ์ (Role)</label>
              <Select
                value={newRole}
                onChange={(value) => setNewRole(value)}
                className="w-full h-10"
                options={[
                  { value: 'user', label: 'User (ผู้ใช้งานทั่วไป)' },
                  { value: 'admin', label: 'Admin (ผู้ดูแลระบบ)' },
                ]}
              />
           
            </div>
          </div>
        )}
      </Modal>
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800">
            <WalletOutlined className="text-blue-600" /> 
            บัญชีเทรดของ {selectedUserForAccounts?.name || 'ผู้ใช้งาน'}
          </div>
        }
        open={isAccountsModalVisible}
        onCancel={() => setIsAccountsModalVisible(false)}
        footer={null} // ปิดปุ่ม OK/Cancel ด้านล่าง เพราะเป็นแค่หน้าต่างสำหรับดูข้อมูล
        width={700} // ขยายขนาดให้พอดีกับตาราง
        centered
      >
        <div className="py-4">
          {selectedUserForAccounts?.tradeAccounts && selectedUserForAccounts.tradeAccounts.length > 0 ? (
            <Table
              dataSource={selectedUserForAccounts.tradeAccounts}
              columns={accountDetailsColumns}
              rowKey="id"
              pagination={false}
              className="overflow-x-auto border border-slate-200 rounded-lg"
            />
          ) : (
            <div className="text-center text-slate-500 py-10 bg-slate-50 rounded-lg border border-slate-100">
              <WalletOutlined className="text-4xl text-slate-300 mb-2" />
              <p>ผู้ใช้งานนี้ยังไม่ได้เพิ่มบัญชีเทรด</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}