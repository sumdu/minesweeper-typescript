namespace App
{
	export class FieldClickResult
	{
        public HasChangedCells: boolean;
        public ChangedCellsFlags: boolean[][]; // TODO: change to boolean
        public GameStatus: GameStatusEnum;
        public IsBombCounterChanged: boolean;

        public constructor()
        {
            this.HasChangedCells = false;
            this.IsBombCounterChanged = false;
        }
    }
}