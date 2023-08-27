export class Tokens {
    deepl: string;
    speech: string;
    gitPublic: string;
    gitPrivate: string;

    constructor(deepl: string = "", gitPublic: string = "", gitPrivate: string = "", speech: string = "") {
        this.deepl = deepl;
        this.gitPublic = gitPublic;
        this.gitPrivate = gitPrivate;
        this.speech = speech;
    }
}