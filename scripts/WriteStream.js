const { Writable } = require('node:stream');
const { parser, Changelog, Release } = require('keep-a-changelog');
const { readFileSync, writeFileSync } = require('node:fs');

class WriteStream extends Writable {
  constructor(path, options) {
    super(options);
    this.path = path ?? './CHANGELOG.md';
  }

  _readChangelog() {
    try {
      return parser(readFileSync(this.path, 'utf-8'));
    } catch (e) {
      return new Changelog('Changelog');
    }
  }

  _getUnreleased(changelog) {
    return (
      changelog.findRelease() ??
      changelog.addRelease(new Release()).findRelease()
    );
  }

  _write(chunk, encoding, callback) {
    const changelog = this._readChangelog();
    const unreleased = this._getUnreleased(changelog);
    changelog.format = 'markdownlint';

    const data = chunk
      .toString()
      .trim()
      .split('\n')
      .slice(2)
      .map((line) => line.trim().slice(2));

    const commitType = (commit) => {
      switch (true) {
        case commit.startsWith('feat'):
          return 'added';
        case commit.startsWith('fix'):
          return 'fixed';
        default:
          return 'changed';
      }
    };

    data.forEach((commit) => {
      unreleased.addChange(commitType(commit), commit);
    });

    writeFileSync(this.path, changelog.toString());
    callback();
  }

  _final(callback) {
    callback();
  }
}

module.exports = WriteStream;
