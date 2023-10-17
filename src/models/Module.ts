import Language from "../types/Language";
import Segment from "./Segment";

export default class Module {
    segments: Array<Segment>;
    name: string;
    language: Language;
    voiceName: string;
    //Google UK English Female
    constructor(segments: Array<Segment> = new Array<Segment>(), name: string = "", voiceName: string = "", language = Language.English) {
        this.segments = segments;
        this.name = name;
        this.voiceName = voiceName;
        this.language = language;
    }
}