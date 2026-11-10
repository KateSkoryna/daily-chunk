import { useTranslation, useAppLanguage } from '@daily-chunk/i18n';
import { rem } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function ThemeCheck() {
  const { t } = useTranslation();
  const { appLanguage, setAppLanguage } = useAppLanguage();
  const otherAppLanguage = appLanguage === 'en' ? 'ru' : 'en';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-gutter pt-screen-top"
    >
      <Text className="font-display text-display-l text-foreground">
        Theme check
      </Text>

      <Text className="font-pixel text-label text-foreground">
        rem: {rem.get()}
      </Text>

      <View className="gap-2 border border-border bg-card p-gutter">
        <Text className="font-content text-body text-card-foreground">
          p-gutter box on bg-card
        </Text>
        <Text className="font-content text-body text-muted-foreground">
          text-muted-foreground
        </Text>
      </View>

      <View className="bg-primary p-4">
        <Text className="font-display text-display-btn text-primary-foreground">
          bg-primary
        </Text>
      </View>

      <View className="bg-secondary p-4 tablet:bg-primary">
        <Text className="font-pixel text-label text-secondary-foreground tablet:text-primary-foreground">
          bg-secondary, bg-primary from tablet (37.5rem)
        </Text>
      </View>

      <View className="gap-2">
        <Text className="font-display text-display-btn text-foreground">
          font-display Bungee
        </Text>
        <Text className="font-display-cyrillic text-display-btn text-foreground">
          font-display-cyrillic Привет
        </Text>
        <Text className="font-pixel text-label text-foreground">
          font-pixel VT323
        </Text>
        <Text className="font-pixel-cyrillic text-label text-foreground">
          font-pixel-cyrillic Привет
        </Text>
        <Text className="font-content text-body text-foreground">
          font-content Bahnhof
        </Text>
        <Text className="font-content-semibold text-body text-foreground">
          font-content-semibold Bahnhof
        </Text>
      </View>

      <View className="gap-2 border border-border bg-card p-gutter">
        <Text
          testID="app-language"
          className="font-pixel text-label text-foreground"
        >
          appLanguage: {appLanguage}
        </Text>
        <Text
          testID="words-due"
          className="font-content text-body text-card-foreground"
        >
          {t('home.wordsDue', { count: 5 })}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('settings.appLanguage')}
          onPress={() => setAppLanguage(otherAppLanguage)}
          className="min-h-touch justify-center bg-secondary px-4"
        >
          <Text className="font-pixel text-label text-secondary-foreground">
            {t(`language.${otherAppLanguage}`)}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
