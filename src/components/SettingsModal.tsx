import '../css/SettingsModal.css';
import ReactModal from "react-modal";
import { useState } from "react";
import OptionsModuleFormik from './Forms/OptionsModuleFormik';

interface SettingsModal {
}

export default function SettingsModal({ }: SettingsModal) {
    console.log("SettingsModal")

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='icon-sliders options-button' onClick={() => setShowModal(true)}></button>

            <ReactModal isOpen={showModal} className="view-settings-modal" appElement={document.getElementsByClassName("view-segments")}>
                <OptionsModuleFormik closeModal={closeModal}></OptionsModuleFormik>
            </ReactModal>
        </>
    );

    function closeModal() {
        setShowModal(false);
    }
}