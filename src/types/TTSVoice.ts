// Enum for SsmlVoiceGender
export enum SsmlVoiceGender {
    SSML_VOICE_GENDER_UNSPECIFIED = 'SSML_VOICE_GENDER_UNSPECIFIED',
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    NEUTRAL = 'NEUTRAL'
}

export interface Voice {
    languageCodes: string[];
    name: string;
    ssmlGender: SsmlVoiceGender;
    naturalSampleRateHertz: number;
}

export default Voice;
