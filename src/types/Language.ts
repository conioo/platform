import { LanguagePathName } from "../router/Paths";

enum Language {
    English,
    German,
    Spanish
}

export function convertToEnum(languageName: string): Language {
    let language: Language;

    if (languageName === LanguagePathName.english) {
        language = Language.English;
    }
    else if (languageName === LanguagePathName.german) {
        language = Language.German;
    }
    else if (languageName === LanguagePathName.spanish) {
        language = Language.Spanish;
    }
    else {
        throw new Error("missing language name")
    }

    return language;
}

export function convertToName(language: Language): string {
    let languageName: string;

    if (language === Language.English) {
        languageName = LanguagePathName.english;
    }
    else if (language === Language.German) {
        languageName = LanguagePathName.german;
    }
    else if (language === Language.Spanish) {
        languageName = LanguagePathName.spanish;
    }
    else {
        throw new Error("missing language")
    }

    return languageName;
}

export default Language;