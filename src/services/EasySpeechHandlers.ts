import EasySpeech from "easy-speech";

export function handleEnd()
{
    console.log(EasySpeech.status());
    console.log("end");
}