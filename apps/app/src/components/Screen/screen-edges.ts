import { createContext } from 'react';

export type ScreenEdges = { top: boolean; bottom: boolean };

export const allScreenEdges: ScreenEdges = { top: true, bottom: true };

export const ScreenEdgesContext = createContext<ScreenEdges>(allScreenEdges);
