import Language from "../types/Language";
import TargetLanguage from "../types/TargetLanguage";

export async function TranslateSentences(sentences: Array<string>, language: Language, targetLanguage: TargetLanguage, deeplToken: string): Promise<Array<string>> {
    let sourceLanguage: string = "";

    if (language === Language.English) {
        sourceLanguage = 'en';
    }
    else if(language === Language.German){
        sourceLanguage = 'de';
    }
    else if(language === Language.Spanish){
        sourceLanguage = 'es';
    }

    const request = require('sync-request');
    const baseApiUrl = `https://api-free.deepl.com/v2/translate?auth_key=${deeplToken}&source_lang=${sourceLanguage}&target_lang=${targetLanguage}`;

    let mainCounter = 0;
    let resultArray: Array<string> = new Array<string>();

    try {

        for (let i: number = 0; mainCounter < sentences.length; ++i) {
            let apiUrl = baseApiUrl;

            for (let j: number = 0; j < 50; ++j) {
                apiUrl += "&text=" + sentences[mainCounter];
                ++mainCounter;

                if (mainCounter === sentences.length) {
                    break;
                }
            }

            console.log(apiUrl);
            const response = request('POST', apiUrl);

            const responseBody = JSON.parse(response.getBody('utf8'));

            const responseTranslations = responseBody.translations.map((translation: any) => translation.text) as Array<string>;

            resultArray = resultArray.concat(responseTranslations);
        }

        return resultArray;
    } catch (error: any) {
        return ['Error: ' + error.message];
    }
}