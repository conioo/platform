import Segment from "./Segment";

export default class Section {
    segments: Array<Segment>;

    constructor(segments: Array<Segment> = new Array<Segment>(0)) {
        this.segments = segments;
    }
}