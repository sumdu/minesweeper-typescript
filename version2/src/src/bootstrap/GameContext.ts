import { CanvasDrawer } from "../drawer/CanvasDrawer";
import { Field } from "../game/Field";
import { Game } from "../game/Game";
import { Skin } from "../game/Skin";

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

    private _drawer: CanvasDrawer = null;

    public get drawer(): CanvasDrawer 
    { 
        if (!this._drawer)
        {
            let context2d = this.canvas.getContext("2d");
            this._drawer  = new CanvasDrawer(context2d, this.skin, this.field.Width, this.field.Height, this.field.TotalCountOfBombs());
        }
        return this._drawer;
    };
}