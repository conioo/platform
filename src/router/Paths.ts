const Paths = {
    hub: "/:language/",
    browser: "browser/*",
    record: "record",
    view: "view/:fileid",
    modify: "modify/:fileid",
} as const;

export const LanguagePathName = {
    english: "en",
    german: "de",
} as const;

export default Paths;