import { WebSocketProvider } from '@/app/providers/web-socket'
import { FC, ReactNode } from 'react'


interface LayoutProps {
children: ReactNode
}

const Layout: FC<LayoutProps> = ({children}) => {
    return <WebSocketProvider>
    {children}
    </WebSocketProvider>
}

export default Layout