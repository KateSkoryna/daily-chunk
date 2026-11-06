import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 gap-4 px-gutter pb-screen-bottom pt-screen-top">
      <Text className="font-display text-display-xl text-foreground">
        Daily Chunk
      </Text>
      <Text className="font-content text-body text-muted-foreground">
        Placeholder home screen
      </Text>
      <Link href="/dev/theme-check" asChild>
        <Pressable
          accessibilityRole="link"
          className="min-h-touch items-center justify-center bg-primary px-4"
        >
          <Text className="font-display text-display-btn text-primary-foreground">
            Open theme check
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
