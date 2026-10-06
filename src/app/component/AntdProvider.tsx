'use client'

import { ConfigProvider } from 'antd'

const fontFamily = 'var(--font-geist-sans), var(--font-anuphan), ui-sans-serif, system-ui, sans-serif'

export const AntdProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3549d1',
          colorLink: '#3549d1',
          colorSuccess: '#127a50',
          colorError: '#b8382b',
          colorWarning: '#b98010',
          colorText: '#151a23',
          colorTextSecondary: '#5b6574',
          colorBorder: '#cdd4dd',
          colorBorderSecondary: '#e3e8ee',
          colorBgLayout: '#f6f8fa',
          borderRadius: 6,
          borderRadiusLG: 8,
          borderRadiusSM: 4,
          fontFamily,
          fontSize: 14,
          controlHeight: 36,
          boxShadow: '0 1px 3px rgb(16 24 40 / 0.07), 0 1px 2px rgb(16 24 40 / 0.04)',
          boxShadowSecondary: '0 12px 28px -8px rgb(16 24 40 / 0.14), 0 2px 6px rgb(16 24 40 / 0.05)',
        },
        components: {
          Button: { primaryShadow: 'none', defaultShadow: 'none', dangerShadow: 'none', fontWeight: 500 },
          Card: { headerFontSize: 15 },
          Table: { headerBg: '#f6f8fa', headerColor: '#5b6574', rowHoverBg: '#f6f8fa' },
          Modal: { titleFontSize: 17 },
          Tag: { defaultBg: '#eef1f5' },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
