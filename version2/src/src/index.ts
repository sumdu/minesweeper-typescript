import { App } from "./game/App";

class Hello
{
    Hi(): void {
        console.log('Hello there you!');
        new App().Start('a', 'a');
    }
}

new Hello().Hi();
