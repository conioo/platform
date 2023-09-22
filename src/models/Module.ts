import Segment from "./Segment";

export default class Module {
    segments: Array<Segment>;
    name: string;

    constructor(name: string = "", segments: Array<Segment> = new Array<Segment>()) {
        this.segments = segments;
        this.name = name;
    }
}