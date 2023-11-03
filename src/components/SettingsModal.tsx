import '../css/SettingsModal.css';
import ReactModal from "react-modal";
import { useState } from "react";
import OptionsModuleFormik from './Forms/OptionsModule/OptionsModuleFormik';

interface SettingsModal {
    defaultVoiceName: string;
}

export default function SettingsModal({ defaultVoiceName }: SettingsModal) {
    console.log("SettingsModal")

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='icon-sliders options-button' onClick={() => setShowModal(true)}></button>

            <ReactModal isOpen={showModal} className="view-settings-modal" appElement={document.getElementsByClassName("view-segments")}>
                <OptionsModuleFormik closeModal={closeModal} defaultVoiceName={defaultVoiceName}></OptionsModuleFormik>
            </ReactModal>
        </>
    );

    function closeModal() {
        setShowModal(false);
    }
}