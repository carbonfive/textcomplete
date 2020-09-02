# C5's Fork of Textcomplete

[Link](https://github.com/yuku/textcomplete) to original repo.

### Description
This is Carbon Five's fork of Yuku's Textcomplete library. 

The original library positions the emoji dropdown using the initial, one-time compute right-edge of the document as a reference point. This doesn't work for us, since Stickies resizes the document as individual stickies are dragged. In an ideal world, we'd find a way to hack around the library to fix this, but Yuku's library hardcodes the right-edge into the dropdown's positionig logic. To get around this, we forked the library while waiting for a [PR](https://github.com/yuku/textcomplete/pull/329) to be merged into the original repo. Eventually this issue will be fixed upstream. When it is, we can delete this fork.

> Autocomplete for HTMLTextAreaElement and more.

![Publish](https://github.com/yuku/textcomplete/workflows/Publish/badge.svg)
![Test](https://github.com/yuku/textcomplete/workflows/Test/badge.svg)
![GitHub pages](https://github.com/yuku/textcomplete/workflows/GitHub%20pages/badge.svg)

![](./docs/images/demo.gif)

[Document](https://yuku.takahashi.coffee/textcomplete/).

## Packages

Textcomplete consists of subpackages:

Name                          | Description
------------------------------|-------------------------------------------
@textcomplete/core            | Core of Textcomplete.
@textcomplete/textarea        | Editor for HTMLTextAreaEleemnt.
@textcomplete/contenteditable | Editor for contenteditable. (Experimental)
@textcomplete/codemirror      | Editor for CodeMirror. (Experimental)
@textcomplete/utils           | Utility functions for editors.

## Development

### View Document

```bash
yarn install
yarn lerna bootstrap
yarn docs
```

then open http://localhost:1234.

### Release

```bash
yarn release
```

then create a release for the shown tag.

## License

&copy; Yuku Takahashi - This software is licensed under the MIT license.
