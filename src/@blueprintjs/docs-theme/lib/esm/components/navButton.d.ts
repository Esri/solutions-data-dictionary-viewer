/// <reference types="react" />
import { IconName } from "@blueprintjs/core";
import * as React from "react";
export interface INavButtonProps {
    icon: IconName;
    hotkey: string;
    text: string;
    onClick: () => void;
}
export declare const NavButton: React.SFC<INavButtonProps>;
