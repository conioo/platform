import OptionsModuleFormik from '../Forms/OptionsModule/OptionsModuleFormik/OptionsModuleFormik';
import './SettingsModal.scss';

interface SettingsModal {
    defaultVoiceName: string;
    show: boolean;
    handleClose: () => void;
}

export default function SettingsModal({ defaultVoiceName, show, handleClose }: SettingsModal) {
    console.log("SettingsModal")

    return (
        <OptionsModuleFormik closeModal={handleClose} show={show} defaultVoiceName={defaultVoiceName}></OptionsModuleFormik>
    );
}