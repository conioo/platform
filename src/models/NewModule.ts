import Language from "../types/Language";
import Section from "./Section";

export default class Module {
    sections: Array<Section>;
    name: string;
    language: Language;
    targetLanguage: Language;
    voiceName: string;
    
    constructor(sections: Array<Section> = new Array<Section>(), name: string = "", voiceName: string = "", language = Language.English, targetLanguage = Language.Polish) {
        this.sections = sections;
        this.name = name;
        this.voiceName = voiceName;
        this.language = language;
        this.targetLanguage = targetLanguage;
    }
}