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

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';

function RedBar() {
  return (
    <Box
      sx={{
        height: 20,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? 'rgba(255, 0, 0, 0.1)'
            : 'rgb(255 132 132 / 25%)',
      }}
    />
  );
}



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


const [balance, setBalance] = useState("");
useEffect (()=> {
  const fetchBalance = async () =>{
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer)
      const myBalance = await smartContract.balanceOf(accounts[0])
      console.log(formatEther(myBalance))
      setBalance(formatEther(myBalance))
  };
  if (isActive) {
    fetchBalance();
  }
}, [isActive]);

const [aumValue, setAumValue] = useState(0);

  const handleSetAumValue = event => {
    setAumValue(event.target.value);
  };
  const handleBuy = async () => {
    try {
      if (aumValue <= 0) {
        return;
      }

      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const buyValue = parseUnits(aumValue.toString(), "ether");
      const tx = await smartContract.buy({
        value: buyValue.toString(),
      });
      console.log("Transaction hash:", tx.hash);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect  to metamask");
    });
  }, []);

  const handleConnect = () => {
    metaMask.activate(contractChain);
  };

  const handleDisconnect = () => {
    metaMask.resetState();
  };


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
              src = "https://www.gifss.com/economia/bitcoin/images/bitcoin-06.gif"
              alt="Logo"
              style={{ height: 48, width: "auto" }}
          />
          </Typography>
          
            { isActive ? (
        
              <Button color='inherit' onClick={handleDisconnect}> Disconnect </Button>
              )
              :(
              
              <Button color='inherit' onClick={handleConnect}> Connect </Button>
              )
            }
        </Toolbar>
      </AppBar>
      <br></br>
      {isActive && (
        <Container maxWidth="sm">
          <Card sx={{ minWidth: 275, backgroundColor: '#01150', height: '400px', boxShadow: '5px 5px 10px #888888' }}>
            <CardContent>
              <Stack spacing={2}>
              <Typography variant="h5" component="div">
                MetaMask Wallet Balance
              </Typography>
              
              <TextField label="accounts" value={accounts} />
            
              <TextField label="balance" value={balance} />
              <Typography variant="h5" component="div">
                BUY Aum Token
              </Typography>

              <TextField
                required
                id="outlined-required"
                label="Enter amount of Ether you want to buy Aum Token"
                defaultValue=""
                type="number"
                onChange={handleSetAumValue}
              />
        
              <Button variant="contained" onClick={handleBuy}>
                Buy Aum Token
              </Button>
            </Stack>
            </CardContent>     
          </Card>
        </Container>
      )}

    </Box>
      
    </div>
  )
}


