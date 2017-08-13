namespace App
{
    export class GameContext
    {
        public canvas: HTMLCanvasElement;
        public skin: Skin;
        public field: Field;
        public game: Game;
        public timer : number;

        public constructor (canvas: HTMLCanvasElement, skin: Skin, field: Field)
        {
            this.canvas = canvas;
            this.skin = skin;
            this.field = field;
            this.game = new Game();
            this.timer = null;
        }

        private _drawer: Drawer.CanvasDrawer = null;

        public get drawer(): Drawer.CanvasDrawer 
        { 
            if (!this._drawer)
            {
                let context2d = this.canvas.getContext("2d");
                this._drawer  = new Drawer.CanvasDrawer(context2d, this.skin, this.field.Width, this.field.Height);
            }
            return this._drawer;
        };
    }
}