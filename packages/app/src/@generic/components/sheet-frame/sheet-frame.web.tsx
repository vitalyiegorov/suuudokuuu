import { useLingui } from '@lingui/react/macro';
import { router } from 'expo-router';
import { use, useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { HomeHrefConstant } from '../../constants/home-href.constant';
import { applyColorAlpha } from '../../utils/apply-color-alpha.util';

import { SheetFrameStyles as styles } from './sheet-frame.styles';

import type { KeyboardEvent, ReactNode, SyntheticEvent } from 'react';

interface Props {
    readonly accessibilityLabel: string;
    readonly children: ReactNode;
    readonly detents: readonly number[];
}

const dialogStyle = {
    backgroundColor: 'transparent',
    border: 0,
    height: '100%',
    margin: 0,
    maxHeight: 'none',
    maxWidth: 'none',
    padding: 0,
    width: '100%'
};

const focusableSelector = 'button,[href],input,select,textarea,[tabindex]';

const SheetBackdropAlpha = 0.4;
const SheetHandleAlpha = 0.3;

export const SheetFrame = ({ accessibilityLabel, children, detents }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        const previousFocus = document.activeElement;

        dialog?.showModal();
        Array.from(dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
            .find(element => element.tabIndex >= 0 && !element.matches(':disabled,[aria-disabled="true"]'))
            ?.focus();

        return () => {
            dialog?.close();
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
                previousFocus.focus();
            }
        };
    }, []);

    const handleClose = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace(HomeHrefConstant);
        }
    };

    const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
        event.preventDefault();
        handleClose();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
        if (event.key !== 'Tab' || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(focusableSelector)).filter(
            element => element.tabIndex >= 0 && !element.matches(':disabled,[aria-disabled="true"]') && element.getClientRects().length > 0
        );
        const currentIndex = controls.findIndex(element => element === document.activeElement);
        const nextIndex = event.shiftKey ? Math.max(currentIndex, 0) - 1 : currentIndex + 1;

        event.preventDefault();
        controls[(nextIndex + controls.length) % controls.length]?.focus();
    };

    const [initialDetent = 1] = detents;
    const backdropStyles = [styles.backdrop, { backgroundColor: applyColorAlpha(theme.colors.ink, SheetBackdropAlpha) }];
    const panelStyles = [styles.panel, { backgroundColor: theme.colors.background, height: `${initialDetent * 100}%` as const }];
    const handleStyles = [styles.handle, { backgroundColor: applyColorAlpha(theme.colors.text.primary, SheetHandleAlpha) }];

    return (
        <dialog
            aria-label={accessibilityLabel}
            aria-modal="true"
            onCancel={handleCancel}
            onKeyDown={handleKeyDown}
            ref={dialogRef}
            style={dialogStyle}
        >
            <View style={styles.root}>
                <Pressable tabIndex={-1} accessibilityLabel={t`Close`} onPress={handleClose} style={backdropStyles} />
                <View style={panelStyles}>
                    <View style={handleStyles} />
                    {children}
                </View>
            </View>
        </dialog>
    );
};
