/**
 * Efficiently detect when an HTMLElement is resized.
 *
 * Attaches an invisible "resize-sensor" div to the element. Then it checks
 * the element's offsetWidth and offsetHeight whenever a scroll event is
 * triggered on the "resize-sensor" children. These events are further
 * debounced using requestAnimationFrame.
 *
 * Inspired by: https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
 */
export declare class ResizeSensor {
    static attach(element: HTMLElement, callback: () => void): () => void;
    private static RESIZE_SENSOR_STYLE;
    private static RESIZE_SENSOR_HTML;
    private static debounce(callback);
}
