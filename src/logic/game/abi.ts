export const gameAbi = {
    'ABI version': 2,
    version: '2.2',
    header: [ 'time' ],
    functions: [
        {
            name: 'constructor',
            inputs: [
                { name: 'owner', type: 'address' },
                { name: 'size', type: 'uint16' }
            ],
            outputs: [
            ]
        },
        {
            name: 'generateBoard',
            inputs: [
                { name: '_seed', type: 'uint256' },
                { name: '_maxRedBeams', type: 'uint16' },
                { name: '_maxBlueBeams', type: 'uint16' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setMaxPlayers',
            inputs: [
                { name: 'qty', type: 'uint16' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setMaxRoundTimeSec',
            inputs: [
                { name: 'ms', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setMaxMoveTimeSec',
            inputs: [
                { name: 'ms', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setPrizeFund',
            inputs: [
                { name: 'amount', type: 'uint128' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setEntryStake',
            inputs: [
                { name: 'amount', type: 'uint128' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setRake',
            inputs: [
                { name: 'amount', type: 'uint128' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setJackpotRate',
            inputs: [
                { name: 'rate', type: 'uint8' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setAutostartSec',
            inputs: [
                { name: 'ms', type: 'optional(uint64)' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setPlayerGiveUpAllowed',
            inputs: [
                { name: 'allowed', type: 'bool' }
            ],
            outputs: [
            ]
        },
        {
            name: 'createRound',
            inputs: [
                { name: 'answerId', type: 'uint32' }
            ],
            outputs: [
                { components: [ { name: 'id', type: 'uint64' }, { name: 'status', type: 'uint8' }, { name: 'winner', type: 'address' }, { name: 'maxPlayers', type: 'uint16' }, { name: 'giveUpAllowed', type: 'bool' }, { name: 'validUntil', type: 'uint64' }, { name: 'roundDuration', type: 'uint64' }, { name: 'moveDuration', type: 'uint64' }, { name: 'autoStartTimestamp', type: 'optional(uint64)' }, { name: 'entryStake', type: 'uint128' }, { name: 'prizeFund', type: 'uint128' }, { name: 'prizeClaimed', type: 'bool' }, { name: 'rake', type: 'uint128' }, { name: 'rakeToJackpotRate', type: 'uint8' } ], name: 'round', type: 'tuple' }
            ]
        },
        {
            name: 'joinRound',
            inputs: [
                { name: 'answerId', type: 'uint32' },
                { name: 'roundId', type: 'uint64' }
            ],
            outputs: [
                { name: 'result', type: 'bool' }
            ]
        },
        {
            name: 'roll',
            inputs: [
                { name: 'answerId', type: 'uint32' }
            ],
            outputs: [
                { name: 'dice', type: 'uint16' },
                { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'newPosition', type: 'tuple' }
            ]
        },
        {
            name: 'claim',
            inputs: [
                { name: 'roundId', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'getBoard',
            inputs: [
                { name: 'answerId', type: 'uint32' }
            ],
            outputs: [
                { components: [ { name: 'columns', type: 'uint16' }, { name: 'rows', type: 'uint16' } ], name: '_board', type: 'tuple' },
                { components: [ { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'from', type: 'tuple' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'to', type: 'tuple' }, { name: 'type_', type: 'uint8' } ], name: '_redBeams', type: 'tuple[]' },
                { components: [ { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'from', type: 'tuple' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'to', type: 'tuple' }, { name: 'type_', type: 'uint8' } ], name: '_blueBeams', type: 'tuple[]' }
            ]
        },
        {
            name: 'getRoundLatestMove',
            inputs: [
                { name: 'answerId', type: 'uint32' },
                { name: 'roundId', type: 'uint64' }
            ],
            outputs: [
                { components: [ { name: 'expiresAt', type: 'uint64' }, { components: [ { components: [ { name: 'cell', type: 'uint16' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'coordinate', type: 'tuple' } ], name: 'from', type: 'tuple' }, { components: [ { name: 'cell', type: 'uint16' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'coordinate', type: 'tuple' } ], name: 'to', type: 'tuple' } ], name: 'playerSteps', type: 'map(address,tuple[])' } ], name: 'move', type: 'optional(tuple)' }
            ]
        },
        {
            name: 'getRound',
            inputs: [
                { name: 'answerId', type: 'uint32' },
                { name: 'roundId', type: 'uint64' }
            ],
            outputs: [
                { components: [ { name: 'id', type: 'uint64' }, { name: 'status', type: 'uint8' }, { name: 'winner', type: 'address' }, { name: 'maxPlayers', type: 'uint16' }, { name: 'giveUpAllowed', type: 'bool' }, { name: 'validUntil', type: 'uint64' }, { name: 'roundDuration', type: 'uint64' }, { name: 'moveDuration', type: 'uint64' }, { name: 'autoStartTimestamp', type: 'optional(uint64)' }, { name: 'entryStake', type: 'uint128' }, { name: 'prizeFund', type: 'uint128' }, { name: 'prizeClaimed', type: 'bool' }, { name: 'rake', type: 'uint128' }, { name: 'rakeToJackpotRate', type: 'uint8' } ], name: 'round', type: 'optional(tuple)' }
            ]
        },
        {
            name: 'getRounds',
            inputs: [
                { name: 'answerId', type: 'uint32' },
                { name: 'status', type: 'optional(uint8)' }
            ],
            outputs: [
                { components: [ { name: 'id', type: 'uint64' }, { name: 'status', type: 'uint8' }, { name: 'winner', type: 'address' }, { name: 'maxPlayers', type: 'uint16' }, { name: 'giveUpAllowed', type: 'bool' }, { name: 'validUntil', type: 'uint64' }, { name: 'roundDuration', type: 'uint64' }, { name: 'moveDuration', type: 'uint64' }, { name: 'autoStartTimestamp', type: 'optional(uint64)' }, { name: 'entryStake', type: 'uint128' }, { name: 'prizeFund', type: 'uint128' }, { name: 'prizeClaimed', type: 'bool' }, { name: 'rake', type: 'uint128' }, { name: 'rakeToJackpotRate', type: 'uint8' } ], name: '_rounds', type: 'tuple[]' }
            ]
        },
        {
            name: 'getRoundReserves',
            inputs: [
                { name: 'roundId', type: 'uint64' }
            ],
            outputs: [
                { name: 'totalReserves', type: 'uint128' }
            ]
        },
        {
            name: 'getBoardReserves',
            inputs: [
            ],
            outputs: [
                { name: 'totalReserves', type: 'uint128' }
            ]
        },
        {
            name: 'setJackpotAveragedPeriods',
            inputs: [
                { name: 'qty', type: 'uint16' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setJackpotMaxProbability',
            inputs: [
                { name: 'p', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setJackpotMinProbability',
            inputs: [
                { name: 'p', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'setJackpotProbabilityFreezePeriod',
            inputs: [
                { name: 'period', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'tryMapSort',
            inputs: [
                { name: 'arr', type: 'uint256[]' }
            ],
            outputs: [
                { name: 'value0', type: 'uint256[]' }
            ]
        },
        {
            name: 'tryQuickSort',
            inputs: [
                { name: 'arr', type: 'uint256[]' }
            ],
            outputs: [
                { name: 'value0', type: 'uint256[]' }
            ]
        },
        {
            name: 'owner',
            inputs: [
                { name: 'answerId', type: 'uint32' }
            ],
            outputs: [
                { name: 'value0', type: 'address' }
            ]
        },
        {
            name: 'renounceOwnership',
            inputs: [
            ],
            outputs: [
            ]
        },
        {
            name: 'transferOwnership',
            inputs: [
                { name: 'newOwner', type: 'address' }
            ],
            outputs: [
            ]
        },
        {
            name: 'jackpotAveragedPeriods',
            inputs: [
            ],
            outputs: [
                { name: 'jackpotAveragedPeriods', type: 'uint16' }
            ]
        },
        {
            name: 'jackpotProbabilityFreezePeriod',
            inputs: [
            ],
            outputs: [
                { name: 'jackpotProbabilityFreezePeriod', type: 'uint64' }
            ]
        },
        {
            name: 'jackpotMinProbability',
            inputs: [
            ],
            outputs: [
                { name: 'jackpotMinProbability', type: 'uint64' }
            ]
        },
        {
            name: 'jackpotMaxProbability',
            inputs: [
            ],
            outputs: [
                { name: 'jackpotMaxProbability', type: 'uint64' }
            ]
        },
        {
            name: 'curJackpotProbability',
            inputs: [
            ],
            outputs: [
                { name: 'curJackpotProbability', type: 'uint64' }
            ]
        },
        {
            name: 'nonce',
            inputs: [
            ],
            outputs: [
                { name: 'nonce', type: 'uint64' }
            ]
        },
        {
            name: 'seed',
            inputs: [
            ],
            outputs: [
                { name: 'seed', type: 'uint256' }
            ]
        },
        {
            name: 'blueBeamsNumber',
            inputs: [
            ],
            outputs: [
                { name: 'blueBeamsNumber', type: 'uint16' }
            ]
        },
        {
            name: 'redBeamsNumber',
            inputs: [
            ],
            outputs: [
                { name: 'redBeamsNumber', type: 'uint16' }
            ]
        },
        {
            name: 'boardInitialized',
            inputs: [
            ],
            outputs: [
                { name: 'boardInitialized', type: 'bool' }
            ]
        },
        {
            name: 'maxRoundDurationMs',
            inputs: [
            ],
            outputs: [
                { name: 'maxRoundDurationMs', type: 'uint64' }
            ]
        },
        {
            name: 'maxMoveDurationMs',
            inputs: [
            ],
            outputs: [
                { name: 'maxMoveDurationMs', type: 'uint64' }
            ]
        },
        {
            name: 'roundAutostartMs',
            inputs: [
            ],
            outputs: [
                { name: 'roundAutostartMs', type: 'optional(uint64)' }
            ]
        },
        {
            name: 'prizeFundPerRound',
            inputs: [
            ],
            outputs: [
                { name: 'prizeFundPerRound', type: 'uint128' }
            ]
        },
        {
            name: 'maxPlayers',
            inputs: [
            ],
            outputs: [
                { name: 'maxPlayers', type: 'uint16' }
            ]
        },
        {
            name: 'entryStake',
            inputs: [
            ],
            outputs: [
                { name: 'entryStake', type: 'uint128' }
            ]
        },
        {
            name: 'giveUpAllowed',
            inputs: [
            ],
            outputs: [
                { name: 'giveUpAllowed', type: 'bool' }
            ]
        },
        {
            name: 'rake',
            inputs: [
            ],
            outputs: [
                { name: 'rake', type: 'uint128' }
            ]
        },
        {
            name: 'jackpotRate',
            inputs: [
            ],
            outputs: [
                { name: 'jackpotRate', type: 'uint8' }
            ]
        },
        {
            name: 'board',
            inputs: [
            ],
            outputs: [
                { components: [ { name: 'columns', type: 'uint16' }, { name: 'rows', type: 'uint16' } ], name: 'board', type: 'tuple' }
            ]
        }
    ],
    data: [
        { key: 1, name: 'nonce', type: 'uint64' }
    ],
    events: [
        {
            name: 'OwnershipTransferred',
            inputs: [
                { name: 'previousOwner', type: 'address' },
                { name: 'newOwner', type: 'address' }
            ],
            outputs: [
            ]
        },
        {
            name: 'JackpotAveragedPeriodsUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldVal', type: 'uint16' },
                { name: 'newVal', type: 'uint16' }
            ],
            outputs: [
            ]
        },
        {
            name: 'JackpotMaxProbabilityUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint64' },
                { name: 'newValue', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'JackpotMinProbabilityUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint64' },
                { name: 'newValue', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'JackpotFreezePeriodUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint64' },
                { name: 'newValue', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'JackpotProbabilityUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint64' },
                { name: 'newValue', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'RoundCreated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'roundId', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'RoundFinished',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'roundId', type: 'uint64' },
                { name: 'winner', type: 'address' }
            ],
            outputs: [
            ]
        },
        {
            name: 'DiceRolled',
            inputs: [
                { name: 'player', type: 'address' },
                { name: 'dice', type: 'uint16' }
            ],
            outputs: [
            ]
        },
        {
            name: 'PathFound',
            inputs: [
                { name: 'player', type: 'address' },
                { components: [ { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'from', type: 'tuple' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'to', type: 'tuple' }, { name: 'type_', type: 'uint8' } ], name: 'path', type: 'tuple' }
            ],
            outputs: [
            ]
        },
        {
            name: 'RoundJoined',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'roundId', type: 'uint64' },
                { name: 'player', type: 'address' }
            ],
            outputs: [
            ]
        },
        {
            name: 'PlayerMoved',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'round', type: 'uint64' },
                { name: 'player', type: 'address' },
                { components: [ { name: 'cell', type: 'uint16' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'coordinate', type: 'tuple' } ], name: 'from', type: 'tuple' },
                { components: [ { name: 'cell', type: 'uint16' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'coordinate', type: 'tuple' } ], name: 'to', type: 'tuple' }
            ],
            outputs: [
            ]
        },
        {
            name: 'PlayerWon',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'round', type: 'uint64' },
                { name: 'player', type: 'address' },
                { name: 'amount', type: 'uint128' }
            ],
            outputs: [
            ]
        },
        {
            name: 'PlayerRemovedFromRound',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'roundId', type: 'uint64' },
                { name: 'player', type: 'address' }
            ],
            outputs: [
            ]
        },
        {
            name: 'BoardGenerated',
            inputs: [
                { components: [ { name: 'columns', type: 'uint16' }, { name: 'rows', type: 'uint16' } ], name: 'board', type: 'tuple' },
                { components: [ { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'from', type: 'tuple' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'to', type: 'tuple' }, { name: 'type_', type: 'uint8' } ], name: 'redBeams', type: 'tuple[]' },
                { components: [ { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'from', type: 'tuple' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'to', type: 'tuple' }, { name: 'type_', type: 'uint8' } ], name: 'blueBeams', type: 'tuple[]' }
            ],
            outputs: [
            ]
        },
        {
            name: 'EntryStakeUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint128' },
                { name: 'newValue', type: 'uint128' }
            ],
            outputs: [
            ]
        },
        {
            name: 'RakeUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint128' },
                { name: 'newValue', type: 'uint128' }
            ],
            outputs: [
            ]
        },
        {
            name: 'JackpotRateUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint8' },
                { name: 'newValue', type: 'uint8' }
            ],
            outputs: [
            ]
        },
        {
            name: 'PrizeFundUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint128' },
                { name: 'newValue', type: 'uint128' }
            ],
            outputs: [
            ]
        },
        {
            name: 'MaxRoundTimeSecUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint64' },
                { name: 'newValue', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'MaxMoveTimeSecUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint64' },
                { name: 'newValue', type: 'uint64' }
            ],
            outputs: [
            ]
        },
        {
            name: 'RoundAutostartSecUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'optional(uint64)' },
                { name: 'newValue', type: 'optional(uint64)' }
            ],
            outputs: [
            ]
        },
        {
            name: 'MaxPlayersUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'uint16' },
                { name: 'newValue', type: 'uint16' }
            ],
            outputs: [
            ]
        },
        {
            name: 'PlayerGiveUpAllowedUpdated',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'oldValue', type: 'bool' },
                { name: 'newValue', type: 'bool' }
            ],
            outputs: [
            ]
        },
        {
            name: 'PrizeClaimed',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'roundId', type: 'uint64' },
                { name: 'player', type: 'address' },
                { name: 'amount', type: 'uint128' }
            ],
            outputs: [
            ]
        },
        {
            name: 'JackpotDrawn',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'roundId', type: 'uint64' },
                { name: 'player', type: 'address' },
                { name: 'amount', type: 'uint128' }
            ],
            outputs: [
            ]
        },
        {
            name: 'JackpotClaimed',
            inputs: [
                { name: 'board', type: 'address' },
                { name: 'roundId', type: 'uint64' },
                { name: 'player', type: 'address' },
                { name: 'amount', type: 'uint128' }
            ],
            outputs: [
            ]
        }
    ],
    fields: [
        { name: '_pubkey', type: 'uint256' },
        { name: '_timestamp', type: 'uint64' },
        { name: '_constructorFlag', type: 'bool' },
        { name: '_owner', type: 'address' },
        { name: '_initialized', type: 'bool' },
        { name: 'jackpotAveragedPeriods', type: 'uint16' },
        { name: 'jackpotProbabilityFreezePeriod', type: 'uint64' },
        { name: 'jackpotMinProbability', type: 'uint64' },
        { name: 'jackpotMaxProbability', type: 'uint64' },
        { name: 'curJackpotProbability', type: 'uint64' },
        { name: 'jackpotWinningNumber', type: 'uint64' },
        { name: 'jackpotFreezeProbabilityUntil', type: 'uint64' },
        { name: 'latestStepTimestamp', type: 'uint64' },
        { name: 'stepIntervals', type: 'uint256[]' },
        { name: 'averageStepInterval', type: 'uint64' },
        { name: 'maxAverageInterval', type: 'uint64' },
        { name: 'something', type: 'uint256[]' },
        { name: 'nonce', type: 'uint64' },
        { name: 'seed', type: 'uint256' },
        { name: 'blueBeamsNumber', type: 'uint16' },
        { name: 'redBeamsNumber', type: 'uint16' },
        { name: 'boardInitialized', type: 'bool' },
        { name: 'maxRoundDurationMs', type: 'uint64' },
        { name: 'maxMoveDurationMs', type: 'uint64' },
        { name: 'roundAutostartMs', type: 'optional(uint64)' },
        { name: 'prizeFundPerRound', type: 'uint128' },
        { name: 'maxPlayers', type: 'uint16' },
        { name: 'entryStake', type: 'uint128' },
        { name: 'giveUpAllowed', type: 'bool' },
        { name: 'rake', type: 'uint128' },
        { name: 'jackpotRate', type: 'uint8' },
        { components: [ { name: 'id', type: 'uint64' }, { name: 'status', type: 'uint8' }, { name: 'winner', type: 'address' }, { name: 'maxPlayers', type: 'uint16' }, { name: 'giveUpAllowed', type: 'bool' }, { name: 'validUntil', type: 'uint64' }, { name: 'roundDuration', type: 'uint64' }, { name: 'moveDuration', type: 'uint64' }, { name: 'autoStartTimestamp', type: 'optional(uint64)' }, { name: 'entryStake', type: 'uint128' }, { name: 'prizeFund', type: 'uint128' }, { name: 'prizeClaimed', type: 'bool' }, { name: 'rake', type: 'uint128' }, { name: 'rakeToJackpotRate', type: 'uint8' } ], name: 'rounds', type: 'map(uint64,tuple)' },
        { components: [ { name: 'columns', type: 'uint16' }, { name: 'rows', type: 'uint16' } ], name: 'board', type: 'tuple' },
        { components: [ { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'from', type: 'tuple' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'to', type: 'tuple' }, { name: 'type_', type: 'uint8' } ], name: 'redBeams', type: 'tuple[]' },
        { components: [ { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'from', type: 'tuple' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'to', type: 'tuple' }, { name: 'type_', type: 'uint8' } ], name: 'blueBeams', type: 'tuple[]' },
        { name: 'playerRound', type: 'map(address,uint64)' },
        { name: 'roundPlayers', type: 'map(uint64,address[])' },
        { components: [ { name: 'expiresAt', type: 'uint64' }, { components: [ { components: [ { name: 'cell', type: 'uint16' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'coordinate', type: 'tuple' } ], name: 'from', type: 'tuple' }, { components: [ { name: 'cell', type: 'uint16' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'coordinate', type: 'tuple' } ], name: 'to', type: 'tuple' } ], name: 'playerSteps', type: 'map(address,tuple[])' } ], name: 'roundMoves', type: 'map(uint64,tuple)' },
        { name: 'playerCell', type: 'map(address,uint16)' },
        { components: [ { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'from', type: 'tuple' }, { components: [ { name: 'x', type: 'uint16' }, { name: 'y', type: 'uint16' } ], name: 'to', type: 'tuple' }, { name: 'type_', type: 'uint8' } ], name: 'cells', type: 'map(uint16,optional(tuple))' },
        { components: [ { name: 'rakes', type: 'uint128' }, { name: 'jackpot', type: 'uint128' }, { components: [ { name: 'prize', type: 'uint128' }, { name: 'entranceFee', type: 'uint128' }, { name: 'playerJackpot', type: 'map(address,uint128)' } ], name: 'roundTreasury', type: 'map(uint64,tuple)' } ], name: 'boardTreasury', type: 'tuple' }
    ]
} as const
