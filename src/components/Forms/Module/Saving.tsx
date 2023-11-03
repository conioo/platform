import { Field } from "formik";
import VoiceSelectField from "./VoiceSelectField";

export default function Saving() {
    return (
        <>
            <VoiceSelectField></VoiceSelectField>

            <section className="save-section">
                Nazwa pliku: <Field name='module.name' id='fileName'></Field>
                <input type="submit" className='save-button' value={"Zapisz"} onClick={() => { }}></input>
            </section>
        </>);
}