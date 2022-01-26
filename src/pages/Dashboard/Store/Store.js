import React, { useState, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import StoreColors from "./Color";
import StoreBodies from './Body';
import StoreEyes from './Eyes';
import StoreNose from './Nose';
import StoreMouth from './Mouth';
import StoreItem from './Items'
import SavingsIcon from '@mui/icons-material/Savings';
import "./store.css";
import AppContext from "../../../AppContext";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

//functions for item store - dialog pop up window and tab functionality 
const ItemStoreDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2)
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1)
    }
}));


const ItemStoreDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

ItemStoreDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired
};

export default function StoreDialog(props) {

    const myContext = useContext(AppContext);

    const handleClose = () => {
        props.setOpen(false);
      };

    //conditional rendering for store items
    const [storeContent, setStoreContent] = useState('Bodies')
    const renderStoreContent = () => {
        if (storeContent === 'Color') {
            return <StoreColors />
        }
        if (storeContent === 'Bodies') {
            return <StoreBodies />
        }
        if (storeContent === 'Eyes') {
            return <StoreEyes />
        }
        if (storeContent === 'Nose') {
            return <StoreNose />
        }
        if (storeContent === 'Mouth') {
            return <StoreMouth />
        }
        if (storeContent === 'Items') {
            return <StoreItem />
        }
    }

    const buttons = [
        <Button key="one" className="tab" onClick={() => setStoreContent('Color')}>COLOR</Button>,
        <Button key="two" className="tab" onClick={() => setStoreContent('Bodies')}>BODY</Button>,
        <Button key="three" className="tab" onClick={() => setStoreContent('Eyes')}>EYES</Button>,
        <Button key="four" className="tab" onClick={() => setStoreContent('Nose')}>NOSE</Button>,
        <Button key="five" className="tab" onClick={() => setStoreContent('Mouth')}>MOUTH</Button>,
        <Button key="six" className="tab" onClick={() => setStoreContent('Items')}>ADD-ONS</Button>,
    ];


    return (
        <div>
            <ItemStoreDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={props.open}
                sx={{ width: '99%' }}
            >
                <ItemStoreDialogTitle
                    id="customized-dialog-title"
                // onClose={handleClose}
                >
                    <div id="tab">
                        {buttons}
                    </div>

                </ItemStoreDialogTitle>
                <div id="store-content">
                    {renderStoreContent()}
                </div>
                <div id="bottom-tab">
                    <div startIcon={<SavingsIcon />} className="coins">
                        {`${myContext.userRascal.coins}`}<span>¢</span>
                    </div>
                    <Button autoFocus onClick={handleClose} id="done">
                        Done
                    </Button>
                </div>
            </ItemStoreDialog>
        </div>
    )


}