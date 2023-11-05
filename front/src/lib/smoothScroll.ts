export function smoothScroll(element: HTMLElement, to: number, duration: number) {
    const start = Date.now();
    function scroller (timestamp: number) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = progress * (to - element.scrollTop) + element.scrollTop;
        element.scrollTop = value;
        if (progress < 1) {
            window.requestAnimationFrame(scroller);
        }
    }
    window.requestAnimationFrame(scroller);
}