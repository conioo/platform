import { Field, useFormikContext } from 'formik';
import '../../css/Forms/OptionsModuleForm.css';
import EasySpeech from 'easy-speech';
import { ModuleOptionsState } from '../../redux/slices/moduleOptions';
import { useSelector } from 'react-redux';
import { selectLanguageState } from '../../redux/slices/language';
import Language from '../../types/Language';
import { useEffect } from 'react';

interface OptionsModuleFormikProps {
    closeModal: () => void;
}

export default function OptionsModuleForm({ closeModal }: OptionsModuleFormikProps) {
    const { values, setFieldValue } = useFormikContext<ModuleOptionsState>();

    let languageState = useSelector(selectLanguageState);
    let voiceOptions: (JSX.Element | undefined)[] = new Array<undefined>();

    if (languageState.language === Language.English) {
        if (languageState.englishVoices !== undefined) {
            voiceOptions = languageState.englishVoices.map((voice, index) => {
                return <option value={voice.name} key={index + "vo"}>{voice.name}</option>
            });
        }
    } else if (languageState.language === Language.German) {
        if (languageState.germanVoices !== undefined) {
            voiceOptions = languageState.germanVoices.map((voice, index) => {
                return <option value={voice.name} key={index + "vo"}>{voice.name}</option>
            });
        }
    }

    return (
        <>
            <section className='options-module-section'>
                <h5>Tryb wyświetlania: </h5>
                <label className="options-module-field-mode">
                    Klasyczne
                    <Field type="radio" name="displayMode" value="classic" className="options-module-field-mode-radio" checked={values.displayMode === 'classic'}></Field>
                </label>
                <label className="options-module-field-mode">
                    Pionowe
                    <Field type="radio" name="displayMode" value="vertical" className="options-module-field-mode-radio" checked={values.displayMode === 'vertical'}></Field>
                </label>
            </section>

            <section className='options-module-section'>
                <h5>Ukryj tłumaczenia: </h5>
                <Field type="checkbox" className="options-module-field-hidden" name="isHidden" checked={values.isHidden}></Field>
            </section>

            <section className='options-module-section'>
                <h5>Głos: </h5>
                <label> <Field as="select" name="voiceName" className="options-module-voice">{voiceOptions}</Field></label>
            </section>

            <section className='options-module-section'>
                <h5>Szybkość odtwarzania: </h5>
                <label><Field type="range" min="0" max="2" step="0.1" value={`${values.playBackSpeed}`} name='playBackSpeed' className="options-module-field-speed"></Field></label>
                <span className='options-module-speed-display'>{values.playBackSpeed}</span>
            </section>

            <section className="options-module-buttons-section">
                <button type='button' onClick={() => setDefaultValues()} className='options-module-button'>Ustaw Domyślne</button>
                <button type='button' onClick={() => closeModal()} className='options-module-button'>Anuluj</button>
                <Field type="submit" value="Zapisz" className='options-module-button'></Field>
            </section>
        </>
    );

    function setDefaultValues() {
        setFieldValue(`displayMode`, 'classic');
        setFieldValue(`playBackSpeed`, 1);
        setFieldValue('isHidden', false);
        setFieldValue('voiceName', "");
    }
}