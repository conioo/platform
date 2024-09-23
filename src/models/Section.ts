import Segment from "./Segment";

export default class Section {
    segments: Array<Segment>;
    audioId: string;// | undefined;

    constructor(segments: Array<Segment> = new Array<Segment>(0)) {
        this.segments = segments;
        this.audioId = "";
    }
}