enum TargetLanguage {
    English = "en",
    German = "de",
    Spanish = 'es',
    Polish = 'pl',
}

const names = {
    en: "Angielski",
    de: "Niemiecki",
    es: "Hiszpański",
    pl: "Polski",
}

export function getTargetLanguageName(language: TargetLanguage) {
    return names[language];
}

export default TargetLanguage;