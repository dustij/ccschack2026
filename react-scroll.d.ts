declare module 'react-scroll' {
  import type * as React from 'react';

  export type ScrollEventHandler = (
    to: string,
    element?: HTMLElement | null,
  ) => void;

  export interface ScrollLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    activeClass?: string;
    to: string;
    spy?: boolean;
    smooth?: boolean | string;
    offset?: number;
    duration?: number;
    delay?: number;
    isDynamic?: boolean;
    ignoreCancelEvents?: boolean;
    hashSpy?: boolean;
    containerId?: string;
    container?: string;
    onSetActive?: ScrollEventHandler;
    onSetInactive?: ScrollEventHandler;
  }

  export const Link: React.ComponentType<ScrollLinkProps>;
}
