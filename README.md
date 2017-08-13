Classic Minesweeper Game written in TypeScript

HOW TO BUILD

# 1. Confirm that your typescript version is 2.4.1 or greater
tsc -v

# 2. Install Typings CLI utility globally
npm install typings --global

# 3. And restore typings as per typings.json configuration file
typings install

# 4. Now you can compile the project
tsc

# To add a new ts definition file, use command as
# typings install dt~jquery --global --save

KNOWN ISSUES

- when dragging pressed mouse over cells, sometime pressed cell stays pressed after cursor leaves that cell (maybe, related to how onmove event is fired, newer coords fired, then older)

TODO

- remember best scores

ALREADY DONE

- (done) - draw pressed cells for middle button
- (done) - bind handler for middle click
- (done)    > verify logic: must be if number inside the cell = number of flags =>
- (done)        > flags correct - open
- (done)        > not correct - blow up
- (done) - redraw smile and pressed cells when dragging mouse
- (done) - add mouse up and down effect on cells
- (done)    > mouse down - pressed effect for cell under cursor
- (done)    > mouse up - click performed for cell under cursor
- (done) - add mouse up and down effect on smile
- (done) - add timer counter
- (done) - add bombs left counter
- (done) - get rid of temporary canvas
- (done) - add game won message or change smile

SIMILAR SITES

http://www.freeminesweeper.org/minecore.html

