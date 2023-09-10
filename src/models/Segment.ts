export default class Segment {
    sentence: string;
    translation: string;

    sentenceColors: Array<number>;
    translationsColors: Array<number>;

    constructor(sentence: string, translation: string) {
        this.sentence = sentence;
        this.translation = translation;

        this.sentenceColors = new Array<number>();
        this.translationsColors = new Array<number>();
    }
}