import React, { useState, useEffect } from "react";
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Scene from './pages/Dashboard/Scene';
import MiniPlayground from './pages/Minigame/index';
import CreateRascal from './pages/CreateRascal/index'
import BottomNav from './pages/Dashboard/BottomNav'
import Dashboard from './pages/Dashboard/Dashboard'
import API from '../utils/API'

export default function ContentContainer() {

  const [currentPage, setCurrentPage] = useState('Login');

  // State variable for current user and token for authentication
  const [userState, setUserState] = useState({
    email: "",
    id: 0
  })
  const [token, setToken] = useState("")
  const [myRascal, setMyRascal] = useState({
    name: '',
    color: '',
    level: 50,
    happiness: 50,
    hunger: 50,
    love: 50,
    care: 50
  })
  const [unlockedItems, setUnlockedItems] = useState([])
  const [equippedItems, setEquippedItems] = useState([])

  function updateRascalStats(key, val) {
    console.log("called")
    setMyRascal({
      ...myRascal,
      [key]: val
    })
  }

  // useeffect on page load to check token in local storage for authenticity, then updating current user, rascal, items
  useEffect(() => {
    const myToken = localStorage.getItem("token");
    API.testRoute({ test: "hello" }, myToken).then(res => console.log(res))
    if (myToken) {
      API.verify(myToken).then(async res => {
        setToken(myToken)
        setUserState({
          email: res.data.email,
          id: res.data.id
        })

        const rascalDat = await API.loadRascal(res.data.id)
        const equipDat = await API.loadEquippedItems(rascalDat.data.id)
        const unlockDat = await API.loadUnlockedItems(rascalDat.data.id)
        setMyRascal(rascalDat.data)
        setEquippedItems(equipDat.data)
        setUnlockedItems(unlockDat.data)
        setCurrentPage("Dashboard")


      }).catch(err => {
        logOut()
      })
    }

  }, [])
  // updates rascal whenever userstate changes
  useEffect(async () => {
    if (userState.id) {
      if(!userState.firstLogin){

        const rascalDat = await API.loadRascal(userState.id)
        console.log(rascalDat)
        const equipDat = await API.loadEquippedItems(rascalDat.data.id)
        const unlockDat = await API.loadUnlockedItems(rascalDat.data.id)
        setMyRascal(rascalDat.data)
        setEquippedItems(equipDat.data)
        setUnlockedItems(unlockDat.data)
        setCurrentPage("Dashboard")
      }

    }
  }, [userState])

  // function for happiness decay TODO: add random effects
  // function decayTimer(){
  //   console.log("step2")
  //     console.log(myRascal.happiness)
  //     console.log(userState)


  //       if(myRascal.happiness > 75){
  //         updateRascalStats("happiness",myRascal.happiness-3)
  //         console.log("big sad")
  //       }else if(myRascal.happiness > 50){
  //         updateRascalStats("happiness",myRascal.happiness-2)
  //         console.log("mid sad")
  //       }else if(myRascal.happiness > 25){
  //         updateRascalStats("happiness",myRascal.happiness-1)
  //         console.log("smol sad")
  //       }
  // }
  // function rascalUpdate() {

  //   setInterval(decayTimer,15000)
  // }


  // logout function being passed down into navbar
  const logOut = () => {
    localStorage.removeItem("token");
    setToken('');
    setUserState({
      email: '',
      userId: 0
    });
    setMyRascal({})
    setEquippedItems([])
    setUnlockedItems([])
    setCurrentPage('Login')
  }

  //starting location for the users coins
  const [userCoins, setUserCoins] = useState(2500);
  //starting location for users level
  const [userLevel, setUserLevel] = useState(myRascal.level);


  // This method is checking to see what the value of `currentPage` is. Depending on the value of currentPage, we return the corresponding component to render.
  const renderPage = () => {
    if (currentPage === 'SignUp') {
      return <SignUp token={token} setToken={setToken} userState={userState} setUserState={setUserState} currentPage={currentPage} handlePageChange={handlePageChange} />;
    }
    if (currentPage === 'Login') {
      return <Login token={token} setToken={setToken} userState={userState} setUserState={setUserState} currentPage={currentPage} handlePageChange={handlePageChange} />;
    }
    if (currentPage === 'CreateRascal') {
      return (
        <div>
          <CreateRascal setMyRascal={setMyRascal} equippedItems={equippedItems} unlockedItems={unlockedItems} setEquippedItems={setEquippedItems} setUnlockedItems={setUnlockedItems} userState={userState} handlePageChange={handlePageChange} />
          <Scene currentPage={currentPage} handlePageChange={handlePageChange} userId={userState.id} logOut={logOut} myRascal={myRascal} setMyRascal={setMyRascal} equippedItems={equippedItems} unlockedItems={unlockedItems} setEquippedItems={setEquippedItems} setUnlockedItems={setUnlockedItems} />
          <BottomNav myRascal={myRascal} />

        </div>
      )
    }
    if (currentPage === 'Dashboard') {
      return (
        <div>
          {myRascal.color && unlockedItems[0] && <Dashboard currentPage={currentPage} handlePageChange={handlePageChange} userId={userState.id} logOut={logOut} myRascal={myRascal} setMyRascal={setMyRascal} equippedItems={equippedItems} unlockedItems={unlockedItems} setEquippedItems={setEquippedItems} setUnlockedItems={setUnlockedItems} />}
        </div>
      )
    }
    return (
      <div>
        <MiniPlayground currentPage={currentPage} handlePageChange={handlePageChange} userId={userState.id} logOut={logOut} myRascal={myRascal} userCoins={userCoins} setUserCoins={setUserCoins} userLevel={userLevel} setUserLevel={setUserLevel} currentPage={currentPage} handlePageChange={handlePageChange} />
      </div>
    )
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div>
      {renderPage()}
    </div>
  );
}