import Language from "../types/Language";
import Segment from "./Segment";

export default class Module {
    segments: Array<Segment>;
    name: string;
    language: Language;
    voiceType: number;

    constructor(segments: Array<Segment> = new Array<Segment>(), name: string = "", voiceType: number = 0, language = Language.English) {
        this.segments = segments;
        this.name = name;
        this.voiceType = voiceType;
        this.language = language;
    }
}