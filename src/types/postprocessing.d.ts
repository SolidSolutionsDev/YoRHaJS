declare module 'postprocessing' {
    export class EffectComposer {
        constructor(renderer: any);
        render(deltaTime: number): void;
        reset(): void;
        addPass(pass: any): void;
    }
    export class EffectPass {
        constructor(camera: any, ...effects: any[]);
        renderToScreen: boolean;
    }
    export class RenderPass {
        constructor(scene: any, camera: any);
    }
    export class BloomEffect { }
}
