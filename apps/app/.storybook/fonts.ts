import bungeeUrl from '@expo-google-fonts/bungee/400Regular/Bungee_400Regular.ttf?url';
import ibmPlexSansUrl from '@expo-google-fonts/ibm-plex-sans/400Regular/IBMPlexSans_400Regular.ttf?url';
import ibmPlexSansSemiBoldUrl from '@expo-google-fonts/ibm-plex-sans/600SemiBold/IBMPlexSans_600SemiBold.ttf?url';
import pixelifySansUrl from '@expo-google-fonts/pixelify-sans/400Regular/PixelifySans_400Regular.ttf?url';
import russoOneUrl from '@expo-google-fonts/russo-one/400Regular/RussoOne_400Regular.ttf?url';
import vt323Url from '@expo-google-fonts/vt323/400Regular/VT323_400Regular.ttf?url';

const fontSources = {
  Bungee_400Regular: bungeeUrl,
  RussoOne_400Regular: russoOneUrl,
  VT323_400Regular: vt323Url,
  PixelifySans_400Regular: pixelifySansUrl,
  IBMPlexSans_400Regular: ibmPlexSansUrl,
  IBMPlexSans_600SemiBold: ibmPlexSansSemiBoldUrl,
};

export async function loadFonts() {
  await Promise.all(
    Object.entries(fontSources).map(async ([family, url]) => {
      const face = new FontFace(family, `url(${url})`);
      await face.load();
      document.fonts.add(face);
    }),
  );
}
