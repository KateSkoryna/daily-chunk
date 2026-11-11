import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { createI18n } from './create-i18n';
import { I18nextProvider } from 'react-i18next';
import { useAppLanguage } from './use-app-language';

function AppLanguageProbe() {
  const { appLanguage } = useAppLanguage();
  return <span>{appLanguage}</span>;
}

function renderProbeWith(i18n: ReturnType<typeof createI18n>) {
  return renderToString(
    <I18nextProvider i18n={i18n}>
      <AppLanguageProbe />
    </I18nextProvider>,
  );
}

function renderProbe(appLanguage: 'en' | 'ru') {
  return renderProbeWith(createI18n(appLanguage));
}

describe('useAppLanguage', () => {
  it('reports the language of the provided i18n instance', () => {
    expect(renderProbe('ru')).toContain('ru');
    expect(renderProbe('en')).toContain('en');
  });

  it('reads the new language right after a switch', async () => {
    const i18n = createI18n('en');
    expect(renderProbeWith(i18n)).toContain('en');
    await i18n.changeLanguage('ru');
    expect(renderProbeWith(i18n)).toContain('ru');
  });

  it('changes the language through setAppLanguage', async () => {
    const i18n = createI18n('en');
    let setAppLanguageFromHook:
      ((nextAppLanguage: 'en' | 'ru') => Promise<unknown>) | null = null;
    function Capture() {
      setAppLanguageFromHook = useAppLanguage().setAppLanguage;
      return null;
    }
    renderToString(
      <I18nextProvider i18n={i18n}>
        <Capture />
      </I18nextProvider>,
    );
    await setAppLanguageFromHook!('ru');
    expect(i18n.language).toBe('ru');
  });
});
