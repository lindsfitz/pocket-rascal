import React, { useContext } from "react";
import Slider from 'infinite-react-carousel';
import Button from '@mui/material/Button';
import "./carousel.css"
import AppContext from "./../../AppContext";
import API from './../../utils/API'

export default function Carousel({ prevEvent }) {

    const myContext = useContext(AppContext);

    // useEffect(() => {

    // }, [myContext.equipItems])


    const settings = {
        centerPadding: 35,
        centerMode: true,
        duration: 75,
        slidesToShow: 3
    };
    const colorArray = [...myContext.unlockItems].filter(thingy => thingy.type === 'color')
    const bodyArray = [...myContext.unlockItems].filter(thingy => thingy.type === 'body')
    const eyesArray = [...myContext.unlockItems].filter(thingy => thingy.type === 'eyes')
    const noseArray = [...myContext.unlockItems].filter(thingy => thingy.type === 'nose')
    const mouthArray = [...myContext.unlockItems].filter(thingy => thingy.type === 'mouth')
    const itemsArray = [...myContext.unlockItems].filter(thingy => thingy.type === 'item')
    var newEquippedArray = [...myContext.equipItems]
    var count = 0
    function equipItem(e) {
        ++count
        let source = e.target.getAttribute("src")
        var isolate = source.split('/')[2].split('.')[0]
        let findItem = itemsArray.filter(item => item.name === isolate)
        newEquippedArray.push(findItem[0])
        if (newEquippedArray.length > 8) { newEquippedArray.length = 8 }
        myContext.setEquipItems(newEquippedArray)
        myContext.setUserRascal({...myContext.userRascal,count:count})
        console.log(newEquippedArray)
        API.updateEquippedItems(myContext.userRascal.id,newEquippedArray)

        findItem = []
    }
   

    const color = () => {
        if (colorArray.length === 0) {
            return (
                <div>
                    <Button>
                        <img src="./assets/empty.png" style={{ height: '100%' }} alt='' />
                    </Button>
                </div>
            )
        }
        return colorArray.map((object, i) =>
            <div obj={object} key={i}>
                <div>
                    <Button >
                        <img src={`./assets/body_fuzzy_${object.name}.png`} id={`equip${object.name}`} style={{ objectFit: 'cover', height: '42px', objectPosition: '-1% center' }} data-id="color" value={object.name} alt='' />
                    </Button>
                </div>
            </div>)
    }

    const body = () => {
        if (bodyArray.length === 0) {
            return (
                <div>
                    <Button >
                        <img src="./assets/empty.png" style={{ height: '100%' }} alt='' />
                    </Button>
                </div>
            )
        }
        return bodyArray.map((object, i) =>
            <div obj={object} key={i}>
                <div>
                    <Button >
                        <img src={`./assets/${object.name}.png`} id={`equip${object.name}`} style={{ objectFit: 'cover', height: '42px', objectPosition: '-1% center' }} />
                    </Button>
                </div>
            </div>)
    }

    const eyes = () => {
        if (eyesArray.length === 0) {
            return (
                <div>
                    <Button >
                        <img src="./assets/empty.png" style={{ height: '100%' }} alt='' />
                    </Button>
                </div>
            )
        }
        return eyesArray.map((object, i) =>
            <div obj={object} key={i}>
                <div>
                    <Button >
                        <img src={`./assets/${object.name}.png`} id={`equip${object.name}`} style={{ objectFit: 'cover', height: '100px', objectPosition: '0.69% 8px' }} alt='' />
                    </Button>
                </div>
            </div>)
    }

    const nose = () => {
        if (noseArray.length === 0) {
            return (
                <div>
                    <Button >
                        <img src="./assets/empty.png" style={{ height: '100%' }} alt='' />
                    </Button>
                </div>
            )
        }
        return noseArray.map((object, i) =>
            <div obj={object} key={i}>
                <div>
                    <Button >
                        <img src={`./assets/${object.name}.png`} id={`equip${object.name}`} style={{ objectFit: 'cover', height: '90px', objectPosition: '50% -2px' }} alt='' />
                    </Button>
                </div>
            </div>)
    }

    const mouth = () => {
        if (mouthArray.length === 0) {
            return (
                <div>
                    <Button >
                        <img src="./assets/empty.png" style={{ height: '100%' }} alt='' />
                    </Button>
                </div>
            )
        }
        return mouthArray.map((object, i) =>
            <div obj={object} key={i}>
                <Button >
                    <img src={`./assets/${object.name}.png`} id={`equip${object.name}`} style={{ objectFit: 'cover', height: '120px', objectPosition: '50% -8px' }} alt='' />
                </Button>
            </div>)
    }

    const items = () => {

        if (itemsArray.length === 0) {
            return (
                <div>
                    <Button >
                        <img src="./assets/empty.png" style={{ height: '100%' }} alt='' />
                    </Button>
                </div>
            )
        }
        return itemsArray.map((object, i) =>
            <div>
                <Button >
                    <img src={`./assets/${object.name}.png`} onClick={equipItem} item-size={`${object.size}`} style={{ height: '100%' }} alt='' />
                </Button>
            </div>
        )
    }

    var tempArray = () => {
        return (
            prevEvent === 'color' ? (colorArray)
                : prevEvent === 'body' ? (bodyArray)
                    : prevEvent === 'eyes' ? (eyesArray)
                        : prevEvent === 'nose' ? (noseArray)
                            : prevEvent === 'mouth' ? (mouthArray)
                                : prevEvent === 'items' ? (itemsArray)
                                    : []
        )
    }

    return (
        <div style={{ width: '70%', maxWidth: '400px', margin: 'auto' }} id="custom-slider">
            <Slider {...settings} prevEvent={prevEvent}>
                {prevEvent === 'color' ? (color())
                    : prevEvent === 'body' ? (body())
                        : prevEvent === 'eyes' ? (eyes())
                            : prevEvent === 'nose' ? (nose())
                                : prevEvent === 'mouth' ? (mouth())
                                    : prevEvent === 'items' ? (items())
                                        : (<div />)}
            </Slider>
        </div>
    )
    // }
}



