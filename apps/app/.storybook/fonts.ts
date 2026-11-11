import handjetUrl from '@expo-google-fonts/handjet/400Regular/Handjet_400Regular.ttf?url';
import ibmPlexSansUrl from '@expo-google-fonts/ibm-plex-sans/400Regular/IBMPlexSans_400Regular.ttf?url';
import ibmPlexSansSemiBoldUrl from '@expo-google-fonts/ibm-plex-sans/600SemiBold/IBMPlexSans_600SemiBold.ttf?url';
import russoOneUrl from '@expo-google-fonts/russo-one/400Regular/RussoOne_400Regular.ttf?url';

const fontSources = {
  RussoOne_400Regular: russoOneUrl,
  Handjet_400Regular: handjetUrl,
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
