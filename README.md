Classic Minesweeper Game written in TypeScript

# Confirm that your typescript version is 2.4.1 or greater
tsc -v

# Install Typings CLI utility globally
npm install typings --global
# And restore typings as per typings.json configuration file
typings install

# Use following options (only for adding a new typing)
typings install dt~jquery --global --save

Known issues:
- when dragging pressed mouse over cells, sometime pressed cell stays pressed after cursor leaves that cell (maybe, related to how onmove event is fired, newer coords fired, then older)

Todo:
- remember best scores

(done) - draw pressed cells for middle button
(done) - bind handler for middle click
(done)    > verify logic: must be if number inside the cell = number of flags =>
(done)        > flags correct - open
(done)        > not correct - blow up
(done) - redraw smile and pressed cells when dragging mouse
(done) - add mouse up and down effect on cells
(done)    > mouse down - pressed effect for cell under cursor
(done)    > mouse up - click performed for cell under cursor
(done) - add mouse up and down effect on smile
(done) - add timer counter
(done) - add bombs left counter
(done) - get rid of temporary canvas
(done) - add game won message or change smile

Found competitor :)
http://www.freeminesweeper.org/minecore.html

