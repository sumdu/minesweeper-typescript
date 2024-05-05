import { App } from "./game/App";

class Hello
{
    Hi(): void {
        console.log('Hello there you!');
        new App().Start(new HTMLCanvasElement(), new HTMLElement());
    }
}

new Hello().Hi();
