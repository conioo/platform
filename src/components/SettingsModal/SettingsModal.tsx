import './SettingsModal.scss';
import ReactModal from "react-modal";
import { useState } from "react";
import OptionsModuleFormik from '../Forms/OptionsModule/OptionsModuleFormik';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';

interface SettingsModal {
    defaultVoiceName: string;
    show: boolean;
    handleClose: () => void;
}

export default function SettingsModal({ defaultVoiceName, show, handleClose }: SettingsModal) {
    console.log("SettingsModal")

    return (
        <>
            {/* <Modal show={showModal} onHide={closeModal}>
                <Modal.Header>
                    <Modal.Title>Opcje przeglądania</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal> */}

            <ReactModal isOpen={show} className="view-settings-modal" appElement={document.getElementsByClassName("view-segments")}>
                <OptionsModuleFormik closeModal={handleClose} defaultVoiceName={defaultVoiceName}></OptionsModuleFormik>
            </ReactModal>
        </>
    );


}