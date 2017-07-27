///<reference path="../typings/index.d.ts"/>
///<reference path="../app/cell.ts"/>

namespace App
{

    describe('cell creation', () => {
        it('creates cell with a bomb and two bombs in neighbours', () => {
            let c = new Cell(true, 2);
            expect(c.HasBomb).toBe(true);
            expect(c.CountBombsAround).toBe(2);
        });
    });

}