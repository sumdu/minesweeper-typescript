export class MinesweeperException extends Error
{
	constructor(m: string) 
	{
		super(m);
		// Set the prototype explicitly.
		(<any>Object).setPrototypeOf(this, MinesweeperException.prototype);
	}
}