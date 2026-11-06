import { rem } from 'nativewind';
import { ScrollView, Text, View } from 'react-native';

export default function ThemeCheck() {
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
    </ScrollView>
  );
}
