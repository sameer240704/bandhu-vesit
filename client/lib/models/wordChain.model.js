import { Schema, model, models } from "mongoose";

const WordChainSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    stats: {
        bestStreak: {
            type: Number,
            default: 0
        },
        totalGamesPlayed: {
            type: Number,
            default: 0
        },
        totalScore: {
            type: Number,
            default: 0
        },
        averageTimePerWord: {
            type: Number,
            default: 0
        }
    },

    themeStats: {
        animals: {
            gamesPlayed: { type: Number, default: 0 },
            highestScore: { type: Number, default: 0 },
            wordsUsed: [String],
            bestStreak: { type: Number, default: 0 }
        },
        countries: {
            gamesPlayed: { type: Number, default: 0 },
            highestScore: { type: Number, default: 0 },
            wordsUsed: [String],
            bestStreak: { type: Number, default: 0 }
        },
        fruits: {
            gamesPlayed: { type: Number, default: 0 },
            highestScore: { type: Number, default: 0 },
            wordsUsed: [String],
            bestStreak: { type: Number, default: 0 }
        }
    },

    gameHistory: [{
        date: {
            type: Date,
            default: Date.now
        },
        theme: {
            type: String,
            enum: ['animals', 'countries', 'fruits'],
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        streak: {
            type: Number,
            required: true
        },
        wordsUsed: [String],
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true
        },
        timeLimit: {
            type: Number,
            required: true
        },
        totalTimePlayed: {
            type: Number,
            required: true
        }
    }],

    achievements: {
        playedOneTime: { type: Boolean, default: false },
        perfectGame: { type: Boolean, default: false },
        tenStreak: { type: Boolean, default: false },
        hundredGames: { type: Boolean, default: false },
        allThemesPlayed: { type: Boolean, default: false },
        expertLevel: { type: Boolean, default: false }
    },

    preferences: {
        preferredTheme: {
            type: String,
            enum: ['animals', 'countries', 'fruits'],
            default: 'animals'
        },
        startingDifficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        soundEnabled: {
            type: Boolean,
            default: true
        }
    },

    lastPlayed: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

WordChainSchema.index({ userId: 1 });
WordChainSchema.index({ "gameHistory.date": -1 });
WordChainSchema.index({ "stats.bestStreak": -1 });

const WordChain = models.WordChain || model("WordChain", WordChainSchema);

export { WordChain };