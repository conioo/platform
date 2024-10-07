import { Field, useFormikContext } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';
import { useSelector } from 'react-redux';
import { selectLanguageState } from '../../../../redux/slices/language';
import { ModuleOptionsState } from '../../../../redux/slices/moduleOptions';
import ErrorAlerts from '../../../../services/FormikErrorsAlert';
import Language from '../../../../types/Language';
import ViewModes from '../../../../types/ViewModes';
import './OptionsModuleForm.scss';

interface OptionsModuleFormikProps {
    closeModal: () => void;
    defaultVoiceName: string;
    show: boolean;
    betterVoiceName?: string;
}

export default function OptionsModuleForm({ show, closeModal, defaultVoiceName, betterVoiceName }: OptionsModuleFormikProps) {
    const { values, errors, submitForm, setFieldValue, isSubmitting } = useFormikContext<ModuleOptionsState>();

    let languageState = useSelector(selectLanguageState);
    let voiceOptions: (JSX.Element | undefined)[] = new Array<undefined>();

    useEffect(() => {
        if (isSubmitting === false) {
            ErrorAlerts(errors);
        }
    }, [isSubmitting]);

    useEffect(() => {
        if (!values.voiceName) {
            setFieldValue('voiceName', betterVoiceName ? betterVoiceName : defaultVoiceName);
        }
    }, []);

    if (languageState.language === Language.English) {
        if (languageState.englishVoices !== undefined) {
            voiceOptions = languageState.englishVoices.map((voice, index) => {
                return <option value={voice.name} key={index}>{voice.name}</option>
            });
        }
    } else if (languageState.language === Language.German) {
        if (languageState.germanVoices !== undefined) {
            voiceOptions = languageState.germanVoices.map((voice, index) => {
                return <option value={voice.name} key={index}>{voice.name}</option>
            });
        }
    } else if (languageState.language === Language.Spanish) {
        if (languageState.spanishVoices !== undefined) {
            voiceOptions = languageState.spanishVoices.map((voice, index) => {
                return <option value={voice.name} key={index}>{voice.name}</option>
            });
        }
    }

    if (betterVoiceName) {
        voiceOptions = [<option value={betterVoiceName} key={0}>{betterVoiceName}</option>];
    }

    const viewModes = useMemo(() => {
        return Object.values(ViewModes).map((viewMode: ViewModes, index: number) => {

            return (<section className='form-check options-module-form__view-mode' key={index}>
                <Form.Label className='options-module-form__view-label'>
                    <Field name="displayMode" type="radio" value={viewMode} as="input" className="form-check-input options-module-form__view-field"></Field>
                    {viewMode}
                </Form.Label>
            </section>);
        });
    }, []);

    return (
        <Modal show={show} onHide={closeModal}>
            <Modal.Header className='options-module-form__header'>
                <Modal.Title>Opcje przeglądania</Modal.Title>
            </Modal.Header>
            <Modal.Body className='options-module-form__body'>
                <section>

                    <section className='options-module-form__view-modes'>
                        <h6>Tryb wyświetlania: </h6>
                        {viewModes}
                    </section>

                    <section className='options-module-form__visible'>
                        <h6>Ukryj tłumaczenia: </h6>
                        <section className='form-check form-switch'>
                            <Form.Label className='options-module-form__visible-label'>
                                <Field type="checkbox" className="form-check-input options-module-form__visible-field" name="isHidden"></Field>
                            </Form.Label>
                        </section>
                    </section>

                    <section className='options-module-form__voices'>
                        <h6>Wybierz głos: </h6>
                        <Form.Label className='options-module-form__voices-label'>
                            <Field as="select" name="voiceName" className="form-select options-module-form__voices-field" default={betterVoiceName ? betterVoiceName : values.voiceName}>
                                {voiceOptions}
                            </Field>
                        </Form.Label>
                    </section>

                    <section className='options-module-form__speed'>
                        <h6>Szybkość odtwarzania: </h6>
                        <Form.Label className='options-module-form__speed-label'>
                            <Field as="input" type="range" min="0.1" max="2" step="0.1" value={`${values.playBackSpeed}`} name='playBackSpeed' className="form-range"></Field>
                            <span className='options-module-form__speed-display'>{values.playBackSpeed}</span>
                        </Form.Label>
                    </section>
                </section>
            </Modal.Body>
            <Modal.Footer className='options-module-form__footer'>
                <Button type='button' variant='secondary' onClick={() => setDefaultValues()}>Ustaw Domyślne</Button>
                <Button type='button' variant='danger' onClick={() => closeModal()}>Anuluj</Button>
                <Button type='button' onClick={() => submitForm()} className='btn btn-success'>Zapisz</Button>
            </Modal.Footer>
        </Modal>
    );

    function setDefaultValues() {
        setFieldValue(`displayMode`, 'classic');
        setFieldValue(`playBackSpeed`, 1);
        setFieldValue('isHidden', true);
        setFieldValue('voiceName', betterVoiceName ? betterVoiceName : defaultVoiceName);
    }
}