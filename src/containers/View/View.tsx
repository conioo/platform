import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useCookies } from 'react-cookie';
import { useSelector, useStore } from 'react-redux';
import { ActionFunctionArgs, ParamParseKey, Params, useLoaderData, useNavigate } from 'react-router-dom';
import AudioPlay from '../../components/AudioPlay/AudioPlay';
import ReturnButton from '../../components/ReturnButton';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import '../../styles/fontello/css/fontello.css';
import { getModule } from '../../google/GoogleDriveService';
import Module from '../../models/Module';
import { selectIsLogin } from '../../redux/slices/authentication';
import { selectBasePath, selectIsEasySpeech } from '../../redux/slices/language';
import { ModuleOptionsState, selectAllOptions, setOptions, setVoiceName } from '../../redux/slices/moduleOptions';
import Paths from '../../router/Paths';
import ChangeVoice, { ChangeVoiceRate, getEasySpeech } from '../../services/EasySpeechHandlers';
import { Colors } from '../../types/Colors';
import './View.scss';
import ClassicView from './Views/ClassicView/ClassicView';
import OverlayView from './Views/OverlayView';
import VerticalView from './Views/VerticalView';

interface Args extends ActionFunctionArgs {
    params: Params<ParamParseKey<typeof Paths.view>>;
}

interface loaderReturnType {
    module: Module,
    fileId: string
}

export async function loader({ params }: Args): Promise<loaderReturnType> {
    const fileId = params.fileid;

    if (!fileId) {
        throw new Error("missing file id");
    }

    let module = await getModule(fileId);

    ChangeVoice(module.voiceName);

    return { module, fileId };
}

export default function View(): JSX.Element {
    console.log("View");

    let { module, fileId } = useLoaderData() as loaderReturnType;
    let { playBackSpeed, displayMode, voiceName } = useSelector(selectAllOptions);

    const isEasySpeech = useSelector(selectIsEasySpeech);

    const [audioHub, setAudioHub] = useState(isEasySpeech ? getEasySpeech : undefined);
    const [showModal, setShowModal] = useState(false);
    const [text, setText] = useState<string>("");

    let refToSlider = React.createRef<HTMLInputElement>();
    let store = useStore();

    const [cookies] = useCookies(['view-options']);
    const navigate = useNavigate();
    const basePath = useSelector(selectBasePath);
    const isLogin = useSelector(selectIsLogin);

    console.log(module);

    useEffect(() => {
        let viewOptions = cookies['view-options'] as ModuleOptionsState;

        if (viewOptions === undefined) {
            return;
        }

        store.dispatch(setOptions(viewOptions));

    }, [cookies['view-options']]);

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
        <section className='view'>
            <h1 className='view__mudule-name'>
                {module.name}
            </h1>

            <ReturnButton variant='outline-secondary'></ReturnButton>

            <Form.Label className='view__font-size-label'>
                <Form.Range className='view__font-size-range' min={0.8} max={4} step={0.1} defaultValue={1.4} onChange={(event) => handleChangeFontSize(event.target.value)}></Form.Range>
            </Form.Label>

            <AudioPlay key={"fullText"} text={text} managementAudio={audioHub}></AudioPlay>

            <section className='view__options'>
                {isLogin && <Button className='base-icon-button view__option-button' variant='outline-secondary' onClick={() => { navigate(basePath + "/modify/" + fileId) }}><i className="bi bi-gear-fill"></i></Button>}
                <Button className='base-icon-button view__option-button' variant='outline-secondary' onClick={() => setShowModal(true)}><i className="bi bi-sliders"></i></Button>
                <SettingsModal defaultVoiceName={module.voiceName} handleClose={closeModal} show={showModal}></SettingsModal>
            </section >

            {displayMode === "classic" && <ClassicView module={module} setText={setText} audioHub={audioHub} getColoredSpan={getColoredSpan}></ClassicView>}
            {displayMode === "vertical" && <VerticalView module={module} setText={setText} audioHub={audioHub} getColoredSpan={getColoredSpan}></VerticalView>}
            {displayMode === "overlay" && <OverlayView module={module} setText={setText} audioHub={audioHub}></OverlayView>}
        </section>
    );

    function handleChangeFontSize(newFontSize: string) {
        const viewSegment = document.getElementsByClassName('view')[0] as HTMLElement;

        // const viewTooltip = document.getElementsByClassName('overlay-view__tooltip')[0] as HTMLElement;

        if (viewSegment) {
            viewSegment.style.fontSize = `${newFontSize}rem`;
            document.body.style.setProperty("--tooltip-font-size", `${parseFloat(newFontSize) - 0.6}rem`);
        }

        // if (viewTooltip) {
        //     viewTooltip.style.fontSize = `${newFontSize}rem`;
        // }
    }

    function getSpan(content: string, additionalClassName: string): JSX.Element {
        return (
            <span key={Math.random()} className={additionalClassName} data-type={1}>{content}&nbsp;</span>
        );
    }

    function getColoredSpan(content: string, colorId: number): JSX.Element {

        let color = Colors[colorId];

        return getSpan(content, color);
    }

    function closeModal() {
        setShowModal(false);
    }
}