Changelog
=========

All notable changes to **@kwaia/nodes** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[1.1.0] - 2018-10-11
--------------------

### Added
- Node classes
    - `Aggregator` - Outputs aggregated input values between changes in 
    reference.
    - `ChangeDetector` - Sends 1 to output when current input is different 
    from previous, 0 otherwise.
    - `Merger` - Merges values from all input ports into a single output.
    - `Selector` - Forwards default input to output when reference input is 
    truthy.
    - `Shifter` - Outputs the previous input value.
- Callback namespaces
    - `compare`
    - `equal`
    - `filter`
    - `map`
    - `reduce`
- Examples
    - `helloworld.ts`

### Changed
- Added optional reduce callback to `Debouncer` and `Throttler`

### Deprecated
- `ChangeFilter` in favor of `Filter(filter.change$())`
- `Stringifier` in favor of `Mapper(map.stringify)`
- `JsonStringifier` in favor of `Mapper(map.jsonStringify)`

[1.0.4] - 2018-09-30
--------------------

### Added
- `INode` interface

### Changed
- Fixed bug in `SyncerBase`

[1.0.3] - 2018-09-27
--------------------

### Changed
- Refactored `Syncer`

[1.0.2] - 2018-09-26
--------------------

### Changed
- Fixed port order in ad-hoc node classes

[1.0.1] - 2018-09-26
--------------------

### Changed
- Fixed port index base in ad-hoc node classes

[1.0.0] - 2018-09-26
--------------------

### Added
- Node classes
    - `SequencerBase` - Pre-processes input so it's following a reference order.
    - `SyncerBase` - Pre-processes input so values with the same tag stay 
    together.
    - `TrackerBaseBase` - Pre-processes input so last values are always 
    accessible.
    - `Sequencer` - Forwards input following a reference order.
    - `Syncer` - Synchronizes input values from multiple ports into an array 
    on a single port.
    - `NodeBase` - General purpose base class for nodes.
- Basic classes & types
    - `InPorts` - Shorthand for collection of input ports
    - `OutPorts` - Shorthand for collection of output ports
    - `Node` - Ad-hoc node
- Examples
    - `adder-sequencer.ts`
    - `adder-syncer.ts`
    - `adder-tracker.ts`
    - `noop-ad-hoc.ts`
    - `sequencer.ts`
    - `syncer.ts`

### Changed
- Fixed port index base in ad-hoc node classes
- Refactored many node classes for performance and code clarity
- Refactored port behavior to be symmetric (input - output)

### Removed
- `Splitter`
- `InputBuffer`
- `InputSynchronizer` - In favor of `SyncerBase` & `Syncer`
- `INode` - In favor of `NodeBase`

[0.2.0] - 2018-09-05
--------------------

### Added
- `InputBuffer`
- `InputSynchronizer`
- `Inputs` type
- `Tagger` - Forwards input to output with the tag changed.

### Changed
- Refactored various classes

[0.1.3] - 2018-09-02
--------------------

### Changed
- Moved tslint to dev dependencies

[0.1.2] - 2018-09-02
--------------------

### Added
- tslint
- jasmine

### Changed
- Fixed documentation in various classes

0.1.1 - 2018-09-02
------------------

### Added
- Basic classes & types
    - `INode`
    - `InPort`
    - `IPort`
    - `OutPort`
    - `Ports`
    - `SuperNode` - Groups nodes into a single node.
- Node classes
    - `Batcher` - Sends input to output in batches of a given size.
    - `ChangeFilter`
    - `Debouncer` - Forwards batches of input values with debouncing.
    - `Delayer` - Forwards input to output with a delay.
    - `Filter` - Outputs only those inputs that satisfy the specified filter 
    callback.
    - `Interval` - Outputs Unix timestamp at intervals.
    - `JsonStringifier`
    - `LineSplitter` - Splits input text and sends individual lines to output.
    - `Logger` - Logs input to console.
    - `Mapper` - Sends mapped input to output.
    - `Noop` - Forwards input to output.
    - `Splitter`
    - `StdErr` - Forwards input to `process.stderr`.
    - `StdIn` - Takes input from `process.stdin` and sends it to output.
    - `StdOut` - Forwards input to `process.stdout`.
    - `Stringifier`
    - `Throttler` - Forwards batches of input values with throttling.
- Examples
    - `ad-hoc-super-node.ts`
    - `adder.ts`
    - `json-logger.ts`
    - `line-length-counter.ts`
- Others
    - Grunt process
    - README.md

[1.1.0]: https://github.com/kwaia/nodes/compare/v1.0.4...v1.1.0
[1.0.4]: https://github.com/kwaia/nodes/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/kwaia/nodes/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/kwaia/nodes/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/kwaia/nodes/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/kwaia/nodes/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/kwaia/nodes/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/kwaia/nodes/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/kwaia/nodes/compare/v0.1.1...v0.1.2
