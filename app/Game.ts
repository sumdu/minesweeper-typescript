namespace App
{
	export class Game
	{
        private _gameStarted: Date;
        public get GameStarted(): Date
        {
            return this._gameStarted;
        }
        public set GameStarted(date: Date)
        {
            this._gameStarted = date;
        }

        private _gameEnded: Date;
        public get GameEnded(): Date
        {
            return this._gameEnded;
        }
        public set GameEnded(date: Date)
        {
            this._gameEnded = date;
        }

        private _gameOver: boolean = false;
        public get GameOver():boolean
        {
            return this._gameOver;
        }
        public set GameOver(value:boolean) 
        {
            this._gameOver = value;
        }
    }
}