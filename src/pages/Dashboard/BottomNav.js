import React, { useState, useContext } from "react";
import { Animated } from "react-animated-css";
import Carousel from './Carousel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import './Store/store.css'
import Snackbar from '@mui/material/Snackbar';
import StoreDialog from "./Store/Store";
import AppContext from "./../../AppContext";
import API from "./../../utils/API";





export default function BottomNav({ openFail, setOpenFail }) {

  const myContext = useContext(AppContext);


  const [customMenu, setCustomMenu] = React.useState(false);
  const toggleCustomMenu = () => {
    setCustomMenu(!customMenu);
    if (carousel) {
      setCarousel(false)
    }
    if (myContext.equipItems) {
      setEquippedItemsWindow(false)
    }
  }

  const [carousel, setCarousel] = React.useState(false)
  // const [carouselContent, setCarouselContent] = React.useState(false)
  const [equippedItemsWindow, setEquippedItemsWindow] = React.useState(false)
  const [prevEvent, setPrevEvent] = React.useState('body')
  const toggleCarousel = (event) => {
    setPrevEvent(event);
    if (carousel && event === prevEvent) {
      setCarousel(false)
      setEquippedItemsWindow(false)
    } else {
      setCarousel(true);
      if (event === 'items') {
        setEquippedItemsWindow(true)
      } else {
        setEquippedItemsWindow(false)
      }
    }
  }

  //custom styling variables 
  const equippedItemBtn = {
    padding: 0,
    cursor: 'pointer',
    background: 'white',
    border: 'solid black 3px',
    borderRadius: '50%',
    maxWidth: '40px',
    maxHeight: '40px',
    minWidth: '40px',
    minHeight: '40px'
  }

  const customBtn = {
    padding: 0,
    cursor: 'pointer',
    background: 'white',
    border: 'solid black 3px',
    borderRadius: '50%',
    maxWidth: '50px',
    maxHeight: '50px',
    minWidth: '50px',
    minHeight: '50px'
  }

  const customLabel = {
    padding: '5px 0',
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bolder'
  }

  const bottomNavBtn = {
    maxHeight: '35px',
  }

  //for store modal pop up 
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => () => {
    setOpen(true);

  };



  //remove currently equipped item from rascal
  const removeEquip = (e) => {
    let removeIndex = e.target.getAttribute("itemindex")
    let equipCopy = [...myContext.equipItems]
    equipCopy.splice(removeIndex, 1)
    myContext.setEquipItems(equipCopy)
    elongate()

  }



  let equippedItemsCopy
  function elongate() {
    equippedItemsCopy = [...myContext.equipItems]
    let lengthDiff = 8 - equippedItemsCopy.length
    for (let i = 0; i < lengthDiff; i++) {
      equippedItemsCopy.push({ name: "empty" })
    }
    API.updateEquippedItems(myContext.userRascal.id,equippedItemsCopy)
  }
  elongate()

  /////feed/wash fail message snackbar functions 
  const handleCloseFail = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenFail(false);
  };

  const actionFail = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseFail}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );



  return (
    <div>
      <Animated animationIn="fadeIn" animationOut="fadeOut" animationInDuration={300}  animationOutDuration={200} isVisible={equippedItemsWindow}>
        <Box sx={{ width: '98%', maxWidth: 800, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap', paddingTop: '10px' }} key='equipped-items-list' id="equipped-items" >
          {equippedItemsCopy.map((item, index) => {
            let imgSrc = item.name || "empty"
            return (
              <div key={index}>
                <Button style={equippedItemBtn} itemindex={index} onClick={removeEquip}>
                  <img itemindex={index} src={`./assets/${imgSrc}.png`} alt='' />
                </Button>
              </div>
            )
          })}

        </Box>
      </Animated>

      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
        <Animated animationIn="fadeIn" animationOut="fadeOut" animationInDuration={300} animationOutDuration={200} isVisible={carousel}>
          <Carousel prevEvent={prevEvent} />
        </Animated>

        {customMenu && <Animated animationIn="bounceInUp" animationOut="bounceOutDown" animationInDuration={500} animationOutDuration={500} isVisible={customMenu}>
          <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap', paddingTop: '10px' }}>
            <div>
              <Button style={customBtn} onClick={() => toggleCarousel('color')} >
              </Button>
              <div style={customLabel}>COLOR</div>
            </div>
            <div>
              <Button style={customBtn} onClick={() => toggleCarousel('body')} >
                <img src={`./assets/${myContext.userRascal.body}.png`} style={{ objectFit: 'cover', height: '42px', objectPosition: '-1% center' }} alt='' />
              </Button>
              <div style={customLabel}>BODY</div>
            </div>
            <div>
              <Button style={customBtn} onClick={() => toggleCarousel('eyes')} >
                <img src={`./assets/${myContext.userRascal.eyes}.png`} style={{ objectFit: 'cover', height: '100px', objectPosition: '0.69% 8px' }} alt='' />
              </Button>
              <div style={customLabel}>EYES</div>
            </div>
            <div>
              <Button style={customBtn} onClick={() => toggleCarousel('nose')} >
                <img src={`./assets/${myContext.userRascal.nose}.png`} style={{ objectFit: 'cover', height: '90px', objectPosition: '50% -2px' }} alt='' />
              </Button>
              <div style={customLabel}>NOSE</div>
            </div>
            <div>
              <Button style={customBtn} onClick={() => toggleCarousel('mouth')} >
                <img src={`./assets/${myContext.userRascal.mouth}.png`} style={{ height: '100%' }} alt='' />
              </Button>
              <div style={customLabel}>MOUTH</div>
            </div>
            <div>
              <Button style={customBtn} onClick={() => toggleCarousel('items')} >
                <div style={{ display: 'flex', alignItems: 'center', color: 'black', fontSize: 'xx-large', fontWeight: 'bold' }}>{myContext.equipItems.length}<span style={{ fontSize: 'xxx-large' }}>/</span>8</div>
              </Button>
              <div style={customLabel}>ADD-ONS</div>
            </div>
          </Box>
        </Animated>}

        <div style={{ backgroundColor: 'lightblue', borderTop: 'solid black 5px', paddingBottom: '10px', paddingTop: '10px', zIndex: 3 }}>
          <Box sx={{ width: '90%', maxWidth: 800, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap'}}>
            <Button aria-label="Food" id='FeedRascal'>
              <img src="./assets/cookie.png" alt="cookie" style={bottomNavBtn} />
            </Button>
            <Button aria-label="Care" id='WashRascal' >
              <img src="./assets/soap.png" alt="soap" style={bottomNavBtn} />
            </Button>
            <Button aria-label="Minigame" onClick={() => myContext.setCurrentPage('Minigame')}>
              <img src="./assets/game.png" alt="game" style={bottomNavBtn} />
            </Button>
            <Button aria-label="Store" onClick={handleClickOpen()}>
              <img src="./assets/money.png" alt="money" style={bottomNavBtn} />
            </Button>
            <Button aria-label="Customize" onClick={toggleCustomMenu}>
              <img src="./assets/pencil.png" alt="pencil" style={bottomNavBtn} />
            </Button>
          </Box>
        </div>

        {open && <StoreDialog setOpen={setOpen} open={open} /> }


        <Snackbar
          open={openFail}
          autoHideDuration={6000}
          onClose={handleCloseFail}
          message="You need more coins for this!"
          action={actionFail}
        />

      </div >
    </div>
    );
}
