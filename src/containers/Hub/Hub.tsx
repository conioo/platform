import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { ActionFunctionArgs, Outlet, ParamParseKey, Params } from 'react-router-dom';
import { HandleGapiLoad } from '../../google/services/AuhorizationService';
import { setLanguage } from '../../redux/slices/language';
import { ModuleOptionsState, setOptions } from '../../redux/slices/moduleOptions';
import store from '../../redux/store';
import Paths from '../../router/Paths';
import { EasySpeechInit } from '../../services/EasySpeechHandlers';
import Language from '../../types/Language';
import Footer from '../Footer';
import Header from '../Header';
import './Hub.scss';
import { useAudioPlayer } from 'react-use-audio-player';

//npm start
//npm run deploy

interface Args extends ActionFunctionArgs {
  params: Params<ParamParseKey<typeof Paths.hub>>;
}

let firstLoaded = true;

export async function loader({ params }: Args): Promise<boolean> {
  if (firstLoaded) {
    firstLoaded = false;
    await FirstLoaded();
  }

  const languageName = params.language;

  if (!languageName) {
    throw new Error("missing language");
  }

  let language = languageName as Language;

  store.dispatch(setLanguage(language));

  return true;
}

async function FirstLoaded() {
  HandleGapiLoad();
  await EasySpeechInit();
}

export default function Hub() {
  console.log("Hub");
  //data-bs-theme="dark"
  const [cookies] = useCookies(['view-options']);

  // const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  // const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  //const { load } = useAudioPlayer();

  //const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // useEffect(() => {
  //   fetchAudio();
  // }, []);


  // useEffect(() => {
  //   console.log("laaaaaaaaaaaaaaaaaaaaaaaaaaddddddddd");
  //   load("https://docs.google.com/uc?export=download&id=13s1pwgpWZAbpwYgaFa_MgdxiKGOILCtX", {
  //     autoplay: true,
  //     onend: () => {console.log("konie")}
  //   });
  // }, [load]);

  // const loadAudio = async () => {
  //   //if (audioContext) {
  //   console.log("loadddd");
  //   const response = await fetch('https://docs.google.com/uc?export=download&id=13s1pwgpWZAbpwYgaFa_MgdxiKGOILCtX', {
  //     mode: 'no-cors'
  //   }); // Podaj tutaj swój plik audio
  //   console.log(response);
  //   const arrayBuffer = await response.arrayBuffer();
  //   //const buffer = await audioContext.decodeAudioData(arrayBuffer);
  //   //setAudioBuffer(buffer);
  //   //}
  // };

  // // Odtwarzanie dźwięku
  // const playAudio = () => {
  //   if (audioContext && audioBuffer && !isPlaying) {
  //     const source = audioContext.createBufferSource();
  //     source.buffer = audioBuffer;
  //     source.connect(audioContext.destination);
  //     source.start(0);
  //     sourceRef.current = source;
  //     setIsPlaying(true);

  //     source.onended = () => {
  //       setIsPlaying(false);
  //       sourceRef.current = null;
  //     };
  //   }
  // };

  // // Pauza
  // const pauseAudio = () => {
  //   if (sourceRef.current && isPlaying) {
  //     sourceRef.current.stop();
  //     setIsPlaying(false);
  //   }
  // };

  // const initializeAudioContext = () => {
  //   console.log("iniyyyyyyyy");

  //   //if (!audioContext) {
  //   const context = new AudioContext();
  //   setAudioContext(context);
  //   loadAudio();
  //   //}
  // };


  useEffect(() => {
    const viewOptionsCookie = cookies['view-options'] as ModuleOptionsState | undefined;

    if (viewOptionsCookie) {
      store.dispatch(setOptions(cookies['view-options']));
    }
  }, []);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Funkcja do odtwarzania dźwięku
  // const playAudio = () => {
  //     if (audioRef.current) {
  //         audioRef.current.play();
  //         console.log('Odtwarzanie rozpoczęte.');
  //     }
  // };

  // // Funkcja do pauzowania dźwięku
  // const pauseAudio = () => {
  //     if (audioRef.current) {
  //         audioRef.current.pause();
  //         console.log('Odtwarzanie zatrzymane.');
  //     }
  // };

  return (
    <>
      <Header></Header>

      <section className='hub__sections'>
        <section className='hub__left-section'>
        </section>

        <section className='hub__main-section'>
          {/* <button onClick={() => cast()}>Zamieniamy</button> */}
          {/* <div>
            {audioUrl ? (
              <audio controls>
                <source src={audioUrl} type="audio/mpeg" />
                Twoja przeglądarka nie obsługuje elementu audio.
              </audio>
            ) : (
              <p>Ładowanie pliku audio...</p>
            )}
          </div>

          <div>
            <h1>Odtwarzanie MP3 z Google Drive</h1>

            {/* Ukryty element audio }
            {/* style={{ display: 'none' }} }
            <audio ref={audioRef} controls>
              <source
                src="https://1drv.ms/u/c/58a52d47c2693eff/EYgBR0S8zvFOgAijEhYP1P0BAUJXTuzCgVK30Gn3dbEIEw?e=gHOV2g"
                type="audio/mpeg"
              />
              Twoja przeglądarka nie obsługuje elementu audio.
              https://docs.google.com/uc?export=download&id=13s1pwgpWZAbpwYgaFa_MgdxiKGOILCtX

            </audio>

            <button onClick={() => { initializeAudioContext(); }}>
              Załaduj i zainicjuj odtwarzacz
            </button>
            {/* Przycisk do odtwarzania }
            <button onClick={playAudio}>Odtwórz</button>

            {/* Przycisk do zatrzymywania}
            <button onClick={pauseAudio}>Pauza</button>
          </div> */}

          <Outlet />
        </section>

        <section className='hub__right-section'>
        </section>
      </section>

      <Footer></Footer>
    </>
  );

  // async function cast() {
  //     let res = await gapi.client.drive.files.list({
  //         q: "name='module.json'",
  //     });
  //     let files = res.result.files;

  //     console.log(files);
  //     if (!files) return;

  //     for (let info of files) {

  //         if (!info.id) { console.log("blaad"); break; }

  //         let con = await gapi.client.drive.files.get({
  //             fileId: info.id,
  //             alt: "media"
  //         });

  //         const jsonData = JSON.parse(con.body) as OldModule;

  //         if (jsonData["segments"] === undefined) {
  //             alert(jsonData);
  //         }

  //         let newData = change(jsonData);
  //         console.log(newData);

  //         await updateFileInGoogleDrive(info.id, newData);
  //     }
  // }

  // function change(old: OldModule): Module {
  //     let nof = new Module();

  //     nof.language = old.language;
  //     nof.name = old.name;
  //     nof.voiceName = old.voiceName;
  //     nof.targetLanguage = TargetLanguage.Polish;

  //     let sec = new Array<Section>();

  //     for (let seg of old.segments) {
  //         let one = seg as any;
  //         seg.translationColors = one['translationsColors'];

  //         sec.push(new Section([seg]));
  //     }

  //     nof.sections = sec;

  //     return nof;
  // }
}