// Native Expo and React Native modules that have no JS implementation under Jest.
// Component specs render real screens, so these stubs keep the module graph loadable.
jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

jest.mock('expo-haptics', () => ({
    ImpactFeedbackStyle: { Heavy: 'heavy', Light: 'light', Medium: 'medium' },
    NotificationFeedbackType: { Error: 'error', Success: 'success', Warning: 'warning' },
    impactAsync: jest.fn(),
    notificationAsync: jest.fn()
}));

jest.mock('expo-glass-effect', () => ({ GlassView: 'GlassView', isLiquidGlassAvailable: () => false }));

jest.mock('react-native-share', () => ({ default: { open: jest.fn() }, Social: {} }));

jest.mock('expo-router', () => ({
    Link: 'Link',
    Redirect: 'Redirect',
    useLocalSearchParams: () => ({}),
    useRouter: () => ({ dismissTo: jest.fn(), navigate: jest.fn(), push: jest.fn(), replace: jest.fn() })
}));
