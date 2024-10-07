import Language from "../types/Language";
import TargetLanguage from "../types/TargetLanguage";
import Section from "./Section";

export default class Module {
    sections: Array<Section>;
    name: string;
    language: Language;
    targetLanguage: TargetLanguage;
    voiceName: string;

    synthVoiceCode: string;
    synthVoiceName: string;
    
    constructor(sections: Array<Section> = new Array<Section>(), name: string = "", voiceName: string = "", language = Language.English, targetLanguage = TargetLanguage.Polish) {
        this.sections = sections;
        this.name = name;
        this.voiceName = voiceName;
        this.language = language;
        this.targetLanguage = targetLanguage;

        this.synthVoiceCode = "en-GB";
        this.synthVoiceName = "en-GB-Standard-B";
    }
}