import React, { useState, useEffect, lazy } from "react";
import SignUp from './pages/SignUp';
import Login from './pages/Login';
// import Scene from './pages/Dashboard/Scene';
import MiniPlayground from './pages/Minigame/index';
import CreateRascal from './pages/CreateRascal/index'
import Dashboard from './pages/Dashboard/Dashboard'
import API from './utils/API'
import AppContext from "./AppContext";

// const MiniPlayground = lazy(() => import('./pages/Minigame/index'))
// const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))

export default function ContentContainer() {

  //////////////////////////////////////setting all use state variables/functions to save in global context

  //update content being displayed
  const [currentPage, setCurrentPage] = useState('Login');
  const toggleCurrentPage = (value) => {
    setCurrentPage(value)
  }

  //current user and token for authentication
  const [userState, setUserState] = useState({
    email: "",
    id: 0
  })
  const toggleUserState = (email, id) => {
    setUserState({
      email: email,
      id: id
    })
  }

  const [token, setToken] = useState("")
  const toggleToken = (value) => {
    setToken(value)

  }

  //update users rascal settings
  const [myRascal, setMyRascal] = useState({
    name: '',
    color: '',
    level: 1,
    xp: 0,
    xpToLevelUp: 100,
    happiness: 50,
    hunger: 50,
    love: 50,
    care: 50,
    coins: 1000
  })
  const [rascalBodySave, setRascalBodySave] = useState({})

  // const toggleRascal = (value) => {
  //   setMyRascal(value)
  // }

  //unlocked items -- items in the carousel that can be equipped
  const [unlockedItems, setUnlockedItems] = useState([])
  const toggleUnlockedItems = (value) => {
    setUnlockedItems(value)
  }

  //items currently equipped on the rascal
  const [equippedItems, setEquippedItems] = useState([])
  const toggleEquippedItems = (value) => {
    setEquippedItems(value)
  }



  //////////////////////////////////////////////////////////////// end set state variables 


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
        if (currentPage !== "Dashboard") { setCurrentPage("Dashboard") }


      }).catch(err => {
        logOut()
      })
    }
  }, [])


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

  //////////////////////////////saving all useState variables and const functions to the global context

  const userSettings = {
    currentPage: currentPage,
    setCurrentPage: toggleCurrentPage,
    user: userState,
    setUser: toggleUserState,
    userToken: token,
    setUserToken: toggleToken,
    userRascal: myRascal,
    setUserRascal: setMyRascal,
    equipItems: equippedItems,
    setEquipItems: toggleEquippedItems,
    unlockItems: unlockedItems,
    setUnlockItems: toggleUnlockedItems,
    logOut: logOut,
    rascalBodySave: rascalBodySave,
    setRascalBodySave: setRascalBodySave
  }

  ///////////////////////////////////////end context save


  //use effect for rascal level - runs anytime XP is updated

  useEffect(() => {
    if (rascalBodySave.food) {
      const rascUpdate = { ...rascalBodySave }

      let newHappy = parseFloat(myRascal.happiness) + (rascUpdate.food / 2)
      if (parseFloat(newHappy) > 100) { newHappy = 100 }
      const newXp = myRascal.xp + rascUpdate.food
      delete rascUpdate.food
      setMyRascal({ ...myRascal, ...rascUpdate, happiness: newHappy, xp: newXp })

    } else if (rascalBodySave.suds) {
      const rascUpdate = { ...rascalBodySave }

      let newHappy = parseFloat(myRascal.happiness) + (rascUpdate.suds / 2)
      if (parseFloat(newHappy) > 100) { newHappy = 100 }
      const newXp = myRascal.xp + rascUpdate.suds
      delete rascUpdate.suds
      setMyRascal({ ...myRascal, ...rascUpdate, happiness: newHappy, xp: newXp })

    } else {
      const rascUpdate = { ...rascalBodySave }
      delete rascUpdate.food
      delete rascUpdate.suds
      setMyRascal({ ...myRascal, ...rascUpdate })
    }
  }, [rascalBodySave])
  useEffect(() => {
    let level = myRascal.level;
    let xp = myRascal.xp
    let xpToLevelUp = myRascal.xpToLevelUp;

    if (xp > xpToLevelUp) {
      ++level;
      console.log(level)
      xpToLevelUp = xpToLevelUp + (50 * level)
      let newXP = xp - xpToLevelUp
      setMyRascal({ ...myRascal, level: level, xpToLevelUp: xpToLevelUp, xp: newXP })
    }

    API.updateRascal(userState.id, myRascal)

  }, [myRascal])


  //render correct content for page 
  const renderPage = () => {
    if (currentPage === 'SignUp') {
      return <SignUp />;
    }
    if (currentPage === 'Login') {
      return <Login />;
    }
    if (currentPage === 'CreateRascal') {
      return (
        <div>
          <CreateRascal />
          {/* <Scene /> */}
        </div>
      )
    }
    if (currentPage === 'Dashboard') {
      return (
        <div>
          {myRascal.color && unlockedItems[0] && <Dashboard myRascal={myRascal} setMyRascal={setMyRascal} />}
        </div>
      )
    }
    return (
      <div>
        <MiniPlayground />
      </div>
    )
  };


  ///////////////
  //returning the rendering function wrapped in the context provider. Allows all children to access the global context variables 
  return (
    <div>
      <AppContext.Provider value={userSettings}>
        {renderPage()}
      </AppContext.Provider>
    </div>
  );
}