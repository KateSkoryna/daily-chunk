import { useTranslation, useAppLanguage } from '@daily-chunk/i18n';
import {
  getTargetLanguagePack,
  type PickerGender,
} from '@daily-chunk/languages';
import { rem } from 'nativewind';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ArticleChip } from '../../src/components/ArticleChip/ArticleChip';
import { Noun } from '../../src/components/Noun/Noun';
import { ArticlePicker } from '../../src/components/ArticlePicker/ArticlePicker';
import { Icon } from '../../src/components/Icon/Icon';
import { iconNames } from '../../src/components/Icon/icon-shapes';
import { PressableFocus } from '../../src/components/PressableFocus/PressableFocus';
import { WordCard } from '../../src/components/WordCard/WordCard';
import { Button } from '../../src/components/ui/button';
import { Text as VariantText } from '../../src/components/ui/text';
import { bahnhofCard } from '../../src/mocks/word-cards';
import { HardShadow } from '../../src/theme/HardShadow/HardShadow';
import { Scanlines } from '../../src/theme/Scanlines/Scanlines';

export default function ThemeCheck() {
  const { t } = useTranslation();
  const { appLanguage, setAppLanguage } = useAppLanguage();
  const otherAppLanguage = appLanguage === 'en' ? 'ru' : 'en';
  const [pressStatus, setPressStatus] = useState('not pressed');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [pickedGender, setPickedGender] = useState<PickerGender | null>(null);

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
          font-display Russo One
        </Text>
        <Text className="font-display text-display-btn text-foreground">
          font-display Привет
        </Text>
        <Text className="font-pixel text-label text-foreground">
          font-pixel Handjet
        </Text>
        <Text className="font-pixel text-label text-foreground">
          font-pixel Привет
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

      <View className="gap-4">
        <Text className="font-display text-display-btn text-foreground">
          Layout primitives
        </Text>

        <View className="h-flashcard overflow-hidden border border-border bg-background">
          <Scanlines />
          <VariantText variant="label" className="p-4">
            Scanlines on bg-background
          </VariantText>
        </View>

        <HardShadow className="self-start">
          <View className="bg-primary px-6 py-4">
            <VariantText
              variant="display-btn"
              className="text-primary-foreground"
            >
              HardShadow
            </VariantText>
          </View>
        </HardShadow>

        <PressableFocus
          accessibilityRole="button"
          accessibilityLabel="Hold me"
          onPressIn={() => setPressStatus('pressed')}
          onPressOut={() => setPressStatus('not pressed')}
          className="items-center justify-center self-start bg-card px-6"
        >
          <VariantText variant="display-btn-sm">Hold me</VariantText>
        </PressableFocus>
        <VariantText variant="ui">press: {pressStatus}</VariantText>
      </View>

      <View className="gap-4">
        <Text className="font-display text-display-btn text-foreground">
          Icons
        </Text>
        <View className="flex-row flex-wrap gap-4">
          {iconNames.map((name) => (
            <View key={name} className="items-center gap-1">
              <Icon name={name} decorative className="text-foreground" />
              <VariantText variant="caption">{name}</VariantText>
            </View>
          ))}
        </View>
        <View className="flex-row flex-wrap gap-4">
          <View className="items-center gap-1">
            <Icon name="check" label="Correct" className="text-success" />
            <VariantText variant="caption">Correct (text-success)</VariantText>
          </View>
          <View className="items-center gap-1">
            <Icon name="cross" label="Wrong" className="text-highlight" />
            <VariantText variant="caption">Wrong (text-highlight)</VariantText>
          </View>
          <View className="items-center gap-1">
            <Icon name="mic" label="Record" className="text-ring" />
            <VariantText variant="caption">Record (text-ring)</VariantText>
          </View>
          <View className="items-center gap-1">
            <Icon
              name="speaker"
              label="Listen"
              className="text-muted-foreground"
            />
            <VariantText variant="caption">
              Listen (text-muted-foreground)
            </VariantText>
          </View>
        </View>
      </View>

      <View className="gap-6">
        <Text className="font-display text-display-btn text-foreground">
          Buttons
        </Text>
        <Button>
          <VariantText>Next</VariantText>
        </Button>
        <Button disabled>
          <VariantText>Next</VariantText>
        </Button>
        <View className="flex-row flex-wrap items-center gap-4">
          <Button variant="secondary">
            <Icon name="speaker" decorative />
            <VariantText>Listen</VariantText>
          </Button>
          <Button variant="ghost">
            <VariantText>Skip</VariantText>
          </Button>
          <Button variant="destructive">
            <VariantText>Delete</VariantText>
          </Button>
        </View>
      </View>

      <View className="gap-4">
        <Text className="font-display text-display-btn text-foreground">
          Articles
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <ArticleChip gender="masc" targetLanguage="de" />
          <ArticleChip gender="fem" targetLanguage="de" />
          <ArticleChip gender="neut" targetLanguage="de" />
          <ArticleChip gender="plural" targetLanguage="de" />
        </View>
        <ArticlePicker
          targetLanguage="de"
          value={pickedGender}
          onSelect={setPickedGender}
          accessibilityLabel="Pick the article"
        />
        <ArticlePicker
          targetLanguage="de"
          value="fem"
          correctAnswer="masc"
          onSelect={() => undefined}
          accessibilityLabel="Answered wrong"
        />
        <ArticlePicker
          targetLanguage="de"
          value="neut"
          correctAnswer="neut"
          onSelect={() => undefined}
          accessibilityLabel="Answered correct"
        />
      </View>

      <View className="gap-4">
        <Text className="font-display text-display-btn text-foreground">
          Word card
        </Text>
        <WordCard
          isFlipped={isCardFlipped}
          onFlip={() => setIsCardFlipped(!isCardFlipped)}
          front={
            <View className="flex-1 justify-center gap-2">
              <Noun gender={bahnhofCard.gender} targetLanguage="de">
                {bahnhofCard.noun}
              </Noun>
              <View className="flex-row items-baseline gap-2">
                <Noun gender="plural" targetLanguage="de" variant="word-l">
                  {bahnhofCard.pluralNoun}
                </Noun>
                <VariantText variant="body-sm">
                  {getTargetLanguagePack('de').pluralCaption}
                </VariantText>
              </View>
              <VariantText variant="body">
                {bahnhofCard.translations[appLanguage]}
              </VariantText>
            </View>
          }
          back={
            <View className="flex-1 justify-center gap-2">
              <VariantText variant="word-l">
                {bahnhofCard.example.target}
              </VariantText>
              <VariantText variant="reading">
                {bahnhofCard.example.translations[appLanguage]}
              </VariantText>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
}
