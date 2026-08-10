const resizeCanvas = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void => {
    const { height, width } = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
};

export const observeConfettiCanvasSize = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): ResizeObserver => {
    const resizeObserver = new ResizeObserver(() => void resizeCanvas(canvas, context));

    resizeCanvas(canvas, context);
    resizeObserver.observe(canvas);

    return resizeObserver;
};
