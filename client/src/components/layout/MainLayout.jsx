import React from 'react'
import GlobalLoading from '../common/GlobalLoading'
import AuthModal from '../common/AuthModal'
import Topbar from '../common/Topbar'
import { Box } from '@mui/material'

const MainLayout = () => {
  return (
   <>
    <GlobalLoading/>
    <AuthModal/>
    <Box display="flex" minHeight="100vh">
        <Topbar/>
    </Box>

    
   </>
    
  )
}

export default MainLayout