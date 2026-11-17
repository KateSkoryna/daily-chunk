import type { TabBarTab } from '../components/TabBar/TabBar';
import type { Translate } from './story-text';

export function storyTabs(t: Translate): TabBarTab[] {
  return [
    { key: 'home', label: t('nav.home'), icon: 'home' },
    { key: 'lessons', label: t('nav.lessons'), icon: 'book' },
    { key: 'score', label: t('nav.score'), icon: 'trophy' },
    { key: 'stats', label: t('nav.stats'), icon: 'chart' },
  ];
}
