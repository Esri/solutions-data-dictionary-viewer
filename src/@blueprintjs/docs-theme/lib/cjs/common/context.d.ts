/// <reference types="react" />
import { IBlock, IKssPluginData, IMarkdownPluginData, INpmPluginData, ITsDocBase, ITypescriptPluginData } from "documentalist/dist/client";
/** This docs theme requires Markdown data and optionally supports Typescript and KSS data. */
export declare type IDocsData = IMarkdownPluginData & (ITypescriptPluginData | {}) & (IKssPluginData | {}) & (INpmPluginData | {});
export declare function hasTypescriptData(docs: IDocsData): docs is IMarkdownPluginData & ITypescriptPluginData;
export declare function hasNpmData(docs: IDocsData): docs is IMarkdownPluginData & INpmPluginData;
export declare function hasKssData(docs: IDocsData): docs is IMarkdownPluginData & IKssPluginData;
/**
 * Use React context to transparently provide helpful functions to children.
 * This is basically the pauper's Redux store connector: some central state from the root
 * `Documentation` component is exposed to its children so those in the know can speak
 * directly to their parent.
 */
export interface IDocumentationContext {
    /**
     * Get the Documentalist data.
     * Use the `hasTypescriptData` and `hasKssData` typeguards before accessing those plugins' data.
     */
    getDocsData(): IDocsData;
    /** Render a block of Documentalist documentation to a React node. */
    renderBlock(block: IBlock): React.ReactNode;
    /** Render a Documentalist Typescript type string to a React node. */
    renderType(type: string): React.ReactNode;
    /** Render the text of a "View source" link. */
    renderViewSourceLinkText(entry: ITsDocBase): React.ReactNode;
    /** Open the API browser to the given member name. */
    showApiDocs(name: string): void;
}
/**
 * To enable context access in a React component, assign `static contextTypes` and declare `context` type:
 *
 * ```tsx
 * export class ContextComponent extends React.PureComponent<IApiLinkProps> {
 *     public static contextTypes = DocumentationContextTypes;
 *     public context: IDocumentationContext;
 *
 *     public render() {
 *         return this.context.renderBlock(this.props.block);
 *     }
 * }
 * ```
 */
export declare const DocumentationContextTypes: React.ValidationMap<IDocumentationContext>;
