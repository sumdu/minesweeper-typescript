export class Game
{
    private _gameStarted: Date|null = null;
    public get GameStarted(): Date|null
    {
        return this._gameStarted;
    }
    public set GameStarted(date: Date)
    {
        this._gameStarted = date;
    }

    private _gameEnded: Date|null = null;
    public get GameEnded(): Date|null
    {
        return this._gameEnded;
    }
    public set GameEnded(date: Date)
    {
        this._gameEnded = date;
    }

    private _gameOver: boolean = true;
    public get GameOver():boolean
    {
        return this._gameOver;
    }
    public set GameOver(value:boolean) 
    {
        this._gameOver = value;
    }

    public get GameDurantionInSeconds():number
    {
        if (this.GameStarted && this.GameEnded)
        {
            return this.GameEnded.getSeconds()-this.GameStarted.getSeconds();
        }
        return 0;
    }
}