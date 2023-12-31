import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useSelector, useStore } from 'react-redux';
import { useAsyncValue, useNavigate } from 'react-router-dom';
import AudioPlay from '../../components/AudioPlay/AudioPlay';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import Module from '../../models/Module';
import { selectIsLogin } from '../../redux/slices/authentication';
import { selectBasePath, selectIsEasySpeech } from '../../redux/slices/language';
import { selectAllOptions, setVoiceName } from '../../redux/slices/moduleOptions';
import ChangeVoice, { ChangeVoiceRate, getEasySpeech } from '../../services/EasySpeechHandlers';
// import './View.scss';
import ClassicView from './Views/ClassicView/ClassicView';
import OverlayView from './Views/OverlayView';
import VerticalView from './Views/VerticalView';

interface ViewProps {
    fileId: string;
}

export default function View({ fileId }: ViewProps): JSX.Element {
    console.log("View");

    let { playBackSpeed, displayMode, voiceName } = useSelector(selectAllOptions);

    const module = useAsyncValue() as Module;
    const isEasySpeech = useSelector(selectIsEasySpeech);

    const [audioHub, setAudioHub] = useState(isEasySpeech ? getEasySpeech : undefined);
    const [showModal, setShowModal] = useState(false);
    const [text, setText] = useState<string>("");

    let store = useStore();

    const navigate = useNavigate();
    const basePath = useSelector(selectBasePath);
    const isLogin = useSelector(selectIsLogin);

    useEffect(() => {
        store.dispatch(setVoiceName(module.voiceName));
    }, [])

    useEffect(() => {
        ChangeVoiceRate(playBackSpeed);
    }, [playBackSpeed])

    useEffect(() => {
        ChangeVoice(voiceName);
    }, [voiceName])

    return (
        <>
            <h1 className='view__mudule-name'>
                {module.name}
            </h1>

            <Form.Label className='view__font-size-label'>
                <Form.Range className='view__font-size-range' min={0.8} max={4} step={0.1} defaultValue={1.4} onChange={(event) => handleChangeFontSize(event.target.value)}></Form.Range>
            </Form.Label>

            <AudioPlay key={"fullText"} text={text} managementAudio={audioHub}></AudioPlay>

            <section className='view__options'>
                {isLogin && <Button className='base-icon-button view__option-button' variant='outline-secondary' onClick={() => { navigate(basePath + "/modify/" + fileId, { state: { toMainPage: true } }) }}><i className="bi bi-gear-fill"></i></Button>}
                <Button className='base-icon-button view__option-button' variant='outline-secondary' onClick={() => setShowModal(true)}><i className="bi bi-sliders"></i></Button>
                {showModal && <SettingsModal defaultVoiceName={module.voiceName} handleClose={closeModal} show={showModal}></SettingsModal>}
            </section >

            {displayMode === "classic" && <ClassicView module={module} setText={setText} audioHub={audioHub}></ClassicView>}
            {displayMode === "vertical" && <VerticalView module={module} setText={setText} audioHub={audioHub}></VerticalView>}
            {displayMode === "overlay" && <OverlayView module={module} setText={setText} audioHub={audioHub}></OverlayView>}
        </>
    );

    function handleChangeFontSize(newFontSize: string) {
        const viewSegment = document.getElementsByClassName('view')[0] as HTMLElement;

        if (viewSegment) {
            viewSegment.style.fontSize = `${newFontSize}rem`;
            document.body.style.setProperty("--tooltip-font-size", `${parseFloat(newFontSize) - 0.6}rem`);
        }

        // console.log(document.body.style.getPropertyValue("--tooltip-font-size"));
    }

    function closeModal() {
        setShowModal(false);
    }
}