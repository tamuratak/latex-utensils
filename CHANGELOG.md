# Change Log

## [3.0.0]

- `latexParser.parse` accepts `enableMathCharacterLocation` as an option.

### BREAKING CHANGES

- (#23) `\url{...}` parsed as `UrlCommand`.
- (#23) `\href{...}{...}` parsed as `HrefCommand`.
- `\label{...}`, `\ref{...}`, and others parsed as `LabelCommand`.

## [2.3.0] (2020-12-25)

- Fix parsing `alignedat` and `cases*`.

## [2.2.0] (2020-12-23)

- (#22) Fix parsing [] having spaces.

## [2.1.0] (2020-12-21)

- Add `pmatrix` and others to `MathEnvAligned`.
- Set `"types": "./out/types/src/main.d.ts"`.

## [2.0.3] (2020-07-17)

- Executed `npm audit fix`

## [2.0.2] (2020-06-20)

### Fixed

- Fix latexParser.findNodeAt.

## [2.0.0] (2020-06-09)


### Added

- latexParser.find, findAll, findAllSequences, findNodeAt
- latexParser.pattern

### Fixed

- (#17) Performance issue matching \left and \right

### BREAKING CHANGES

- Rename `latexParser.MathMatchingParen` to `latexParser.MatchingDelimiters`.
- `latexParser.parse` parses mathematical delimiters without `\left` and `\right`, `(...)`, `[...]`, and so on now. The type of delimiters is `latexParser.MathDelimiters`.
- Change the name of the property of `latexParser.Superscript` and `latexParser.Subscript` from `content` to `arg`.

## [1.2.3](https://github.com/tamuratak/latex-utensils/compare/v1.2.2...v1.2.3) (2019-12-31)

### Fixed

- (#11) Fix parsing `\verb*`.
- (#12) Fix parsing `verbatim*` env.
- (#13) Fix picking comments.


## [1.2.2](https://github.com/tamuratak/latex-utensils/compare/v1.2.1...v1.2.2) (2019-12-26)


### Fixed

- Fix dependencies.

## [1.2.1](https://github.com/tamuratak/latex-utensils/compare/v1.2.0...v1.2.1) (2019-12-25)

### Added

- (#10) Add `hasArgsArray` to test if node.args exist.

## [1.2.0](https://github.com/tamuratak/latex-utensils/compare/v1.1.10...v1.2.0) (2019-12-22)

### Added

- (#8) Add `DefCommand` type.

### Fixed

- (#9) Allow spaces in optional arguments.

## [1.1.10](https://github.com/tamuratak/latex-utensils/compare/v1.1.9...v1.1.10) (2019-12-18)

### Fixed

- Refactoring `isSyntaxError`.

## [1.1.9](https://github.com/tamuratak/latex-utensils/compare/v1.1.7...v1.1.9) (2019-12-16)

### Fixed

- (#7) Allow `isbn = 1-2-3` in BibTeX files.
