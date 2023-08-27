export default class AudioInfo<THtmlElement> {
    isSpeaking: boolean = false;
    refToAudio: React.RefObject<THtmlElement>;

    constructor(refToAudio: React.RefObject<THtmlElement>)
    {
        this.refToAudio = refToAudio;
    }
}