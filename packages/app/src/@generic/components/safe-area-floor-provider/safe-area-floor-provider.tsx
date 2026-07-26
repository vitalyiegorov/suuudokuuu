import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const SafeAreaFloorProvider = ({ children }: Props) => <>{children}</>;
