
'use client'

import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import React from 'react'

export default function SignInPage() {
  const [isModalOpen, setisModalOpen] = useState(true)
  

  return (
 
        <div>
            {isModalOpen  && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="mb-4">ครุภัณฑ์ที่ยืม: </h2>
                        <h2 className="mb-4">รหัสครุภัณฑ์: </h2>
                        <h2 className="mb-4">สถานที่ของครุภัณฑ์: </h2>
                        
                    
                    </div>
                    </div>
                )}

        </div>


  )
}