import Segment from "./Segment";

export default class Module {
    segments: Array<Segment>;

    constructor(segments: Array<Segment> = new Array<Segment>()) {
        this.segments = segments;
    }
}