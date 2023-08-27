export class Segment {
    word: string;
    meaning: string | null;
    pathToVoice: string | null;

    constructor(word: string, meaning: string | null = null, pathToVoice: string | null = null) {
        this.word = word;
        this.meaning = meaning;
        this.pathToVoice = pathToVoice;
    }
}