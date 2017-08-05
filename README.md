Classic Minesweeper Game written in TypeScript

# Confirm that your typescript version is 2.4.1 or greater
tsc -v

# Install Typings CLI utility globally
npm install typings --global
# And restore typings as per typings.json configuration file
typings install

# Use following options (only for adding a new typing)
typings install dt~jquery --global --save

Todo:
- redraw smile and pressed cells when dragging mouse
- bind handler for middle click
    > verify logic: must be if number inside the cell = number of flags =>
        > flags correct - open
        > not correct - blow up
- remember best scores

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

