import { LanguagePathName } from "../router/Paths";

enum Language {
    English = "en",
    German = "de",
    Spanish = 'es',
}

const names = {
    en: "Angielski",
    de: "Niemiecki",
    es: "Hiszpański",
}

export function getLanguageName(language: Language) {
    return names[language];
}

export default Language;