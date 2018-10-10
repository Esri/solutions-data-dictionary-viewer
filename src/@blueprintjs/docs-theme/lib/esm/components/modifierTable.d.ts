/// <reference types="react" />
import * as React from "react";
export interface IModifierTableProps {
    /** Message to display when children is empty. */
    emptyMessage?: string;
    /** Title of the first column, describing the type of each row in the table. */
    title: string;
}
export declare const ModifierTable: React.SFC<IModifierTableProps>;
