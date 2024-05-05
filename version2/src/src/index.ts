import { Hello2 } from './module2'

class Hello
{
    Hi(): void {
        console.log('Hello there!');
        new Hello2().Hi2();
    }
}

new Hello().Hi();
