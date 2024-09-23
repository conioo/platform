export default class Segment {
    sentence: string;
    translation: string;

    sentenceColors: Array<number>;
    translationColors: Array<number>;

    constructor(sentence: string, translation: string, defaultColor: number = 0) {
        this.sentence = sentence;
        this.translation = translation;

        this.sentenceColors = new Array<number>(sentence.split(" ").length).fill(defaultColor);
        this.translationColors = new Array<number>(translation.split(" ").length).fill(defaultColor);
    }
}