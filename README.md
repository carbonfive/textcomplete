# C5's Fork of Textcomplete

[Link](https://github.com/yuku/textcomplete) to original repo.

### Description
This is Carbon Five's fork of Yuku's Textcomplete library. 

The original library positions the emoji dropdown using the initial, one-time compute right-edge of the document as a reference point. This doesn't work for us, since Stickies resizes the document as individual stickies are dragged. In an ideal world, we'd find a way to hack around the library to fix this, but Yuku's library hardcodes the right-edge into the dropdown's positionig logic. To get around this, we forked the library while waiting for a [PR](https://github.com/yuku/textcomplete/pull/329) to be merged into the original repo. Eventually this issue will be fixed upstream. When it is, we can delete this fork.

### Usage
To include, do the following:
```
const { Textcomplete } = require("c5-textcomplete").core;
const { TextareaEditor } = require("c5-textcomplete").textarea
```

Note: As of now, only the core and text areas are supported (these are the only two we use with stickies). The others will not work until they are surfaced in the root index.js file.
