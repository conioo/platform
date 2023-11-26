import { Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Form from "react-bootstrap/esm/Form";
import Spinner from "react-bootstrap/esm/Spinner";
import VoiceSelectField from "../VoiceSelectField/VoiceSelectField";
import './Saving.scss';

interface SavingProps {
    goBack: () => void;
}

export default function Saving({ goBack }: SavingProps) {

    const [isSaving, setIsSaving] = useState(false);

    const { submitForm } = useFormikContext();

    useEffect(() => {
        if (isSaving) {
            submitForm();
        }
    }, [isSaving]);

    return (
        <>
            <h2>Zapisywanie</h2>

            <section className="saving__fields">
                <VoiceSelectField className="saving__voice-select"></VoiceSelectField>

                <Form.Group className="saving__filename">
                    <Form.Label>Nazwa Pliku</Form.Label>
                    <Field name='module.name' className="form-control"></Field>
                </Form.Group>
            </section>

            {!isSaving &&
                <Button type="submit" variant="outline-danger" className="saving__save-button" onClick={() => { setIsSaving(true); }}>Zapisz</Button>
            }

            {isSaving &&
                <Button type="submit" className="saving__save-button" variant='danger' disabled>
                    <Spinner animation="border" size='sm' as="span" role='status' aria-hidden="true">
                        <span className="visually-hidden">Zapisywanie...</span>
                    </Spinner>
                    Zapisywanie...
                </Button>
            }

            <ButtonGroup>
                <Button type='button' variant='outline-secondary' onClick={() => { goBack(); }}>Wstecz</Button>
            </ButtonGroup>
        </>);
}