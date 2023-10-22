const Paths = {
    hub: "/:language/",
    browser: "browser/*",
    record: "record",
    view: "view/:fileid",
    modify: "modify/:fileid",
    modifyFolder: "modify-folder/:folderid"
} as const;

export const LanguagePathName = {
    english: "en",
    german: "de",
    spanish: "es"
} as const;

export default Paths;