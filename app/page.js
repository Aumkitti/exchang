"use client"
import React,{useEffect,useState} from 'react';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { ethers } from 'ethers';
import { formatEther,parseUnits } from '@ethersproject/units';
import abi from './abi.json'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';


const [metaMask, hook] = initializeConnector((actions) => new MetaMask({ actions }))
const { useChainId, useAccounts, useIsActicating, useIsActive, useProvider } = hook
const contractChain = 11155111
const contractAddress = '0xcDFe68213b507233cC98cFAC7967b5b762cE7468'




export default function Page() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActive = useIsActive()

  const provider = useProvider()
  const [error, setError] = useState(undefined)
	
  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  const handleConnect = () => {
    metaMask.activate(contractChain)
  }

  const handleDisconnect = () => {
    metaMask.resetState()
  }
  
return (
    <div>

<Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <img
              src = "https://www.gifss.com/economia/bitcoin/images/bitcoin-06.gif" // URL ของรูปภาพโลโก้
              alt="Logo"
              style={{ height: 48, width: "auto" }} // ปรับขนาดตามความต้องการ
/>
          </Typography>
          
            { isActive ? (
              <Stack direction="row" spacing={1}>
              <Chip label={accounts} />
        
              <Button color='inherit' onClick={handleDisconnect}> Disconnect </Button>
              </Stack>)
              :(
              
              <Button color='inherit' onClick={handleConnect}> Connect </Button>
              )
            }
        </Toolbar>
      </AppBar>
    </Box>

      <p>chainId: { chainId }</p>
      <p>isActive: { isActive.toString() }</p>
      
    </div>
  )
}

