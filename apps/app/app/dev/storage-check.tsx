import type { Profile } from '@daily-chunk/core';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { demoProfile } from '../../src/mocks/profile';
import { getStorage } from '../../src/storage/app-storage';

export default function StorageCheck() {
  const [loaded, setLoaded] = useState<Profile | undefined | 'loading'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState<string>();

  const saveProfile = async () => {
    try {
      const storage = await getStorage();
      await storage.profile.save(demoProfile);
      setLoaded(await storage.profile.get());
    } catch (error) {
      setErrorMessage(String(error));
    }
  };

  useEffect(() => {
    getStorage()
      .then((storage) => storage.profile.get())
      .then(setLoaded)
      .catch((error: unknown) => setErrorMessage(String(error)));
  }, []);

  return (
    <View className="flex-1 gap-4 px-gutter pb-screen-bottom pt-screen-top">
      <Text className="font-display text-display-l text-foreground">
        Storage check
      </Text>
      <Text className="font-content text-body text-muted-foreground">
        {errorMessage
          ? `error: ${errorMessage}`
          : loaded === 'loading'
            ? 'loading'
            : loaded
              ? `profile: ${loaded.id}, xp ${loaded.xp}, ${loaded.languages.nativeLanguage} to ${loaded.languages.targetLanguage}`
              : 'profile: none'}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={saveProfile}
        className="min-h-touch items-center justify-center bg-primary px-4"
      >
        <Text className="font-display text-display-btn text-primary-foreground">
          Save demo profile
        </Text>
      </Pressable>
    </View>
  );
}
