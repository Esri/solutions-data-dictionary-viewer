/// <reference types="react" />
import { Intent, IProps } from "@blueprintjs/core";
import * as React from "react";
export interface IBannerProps extends IProps {
    /** Link URL. */
    href: string;
    /**
     * Intent color of banner.
     * @default Intent.PRIMARY
     */
    intent?: Intent;
}
/**
 * Render `Banner` before `Documentation` for a full-width colored banner link across the top of the page.
 * Use this to alert users to make changes or new pages.
 */
export declare class Banner extends React.PureComponent<IBannerProps> {
    render(): JSX.Element;
}
