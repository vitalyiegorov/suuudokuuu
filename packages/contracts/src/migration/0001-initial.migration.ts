import * as Effect from 'effect/Effect';
import * as SqlClient from 'effect/sql/SqlClient';

const createSettingsTable = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`
        CREATE TABLE settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            has_vibration INTEGER NOT NULL,
            has_timer INTEGER NOT NULL,
            show_areas INTEGER NOT NULL,
            show_identical_numbers INTEGER NOT NULL,
            show_combo_animation INTEGER NOT NULL,
            show_filled_numbers INTEGER NOT NULL,
            show_active_candidates INTEGER NOT NULL,
            keep_active_cell INTEGER NOT NULL,
            keep_exhausted_digits INTEGER NOT NULL,
            allow_hints_on_hard_difficulties INTEGER NOT NULL,
            is_left_handed INTEGER NOT NULL,
            calm_mode INTEGER NOT NULL,
            motion_preference TEXT NOT NULL,
            font_size TEXT NOT NULL,
            language TEXT NOT NULL,
            theme TEXT NOT NULL,
            is_dark_color_schema INTEGER NOT NULL,
            cell_margin INTEGER NOT NULL,
            last_game_difficulty TEXT NOT NULL,
            last_game_max_mistakes INTEGER NOT NULL,
            last_game_challenge_mode INTEGER NOT NULL,
            last_stats_difficulty TEXT NOT NULL
        )
    `
);

const createCustomThemesTable = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`
        CREATE TABLE custom_themes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            schema_version INTEGER NOT NULL,
            source_theme TEXT NOT NULL,
            colors TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        )
    `
);

const createCurrentRunTable = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`
        CREATE TABLE current_run (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            sudoku_string TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            rating REAL NOT NULL,
            is_rating_ceiling INTEGER NOT NULL,
            score INTEGER NOT NULL,
            mistakes INTEGER NOT NULL,
            max_mistakes INTEGER NOT NULL,
            elapsed_time INTEGER NOT NULL,
            is_paused INTEGER NOT NULL,
            should_show_pause_screen INTEGER NOT NULL,
            should_resume_on_focus INTEGER NOT NULL,
            show_auto_candidates INTEGER NOT NULL,
            input_mode TEXT NOT NULL,
            candidates TEXT NOT NULL,
            timeline_events TEXT NOT NULL,
            undone_moves TEXT NOT NULL,
            challenge_timeline_events TEXT NOT NULL,
            challenge_state TEXT NOT NULL,
            challenge_time INTEGER NOT NULL,
            wall_clock_start_ms INTEGER NOT NULL,
            is_challenge_run INTEGER NOT NULL,
            daily_day_number INTEGER NOT NULL,
            has_new_personal_best_score INTEGER NOT NULL
        )
    `
);

const createDifficultyStatsTable = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`
        CREATE TABLE difficulty_stats (
            difficulty TEXT PRIMARY KEY,
            games_completed INTEGER NOT NULL,
            games_won INTEGER NOT NULL,
            games_won_without_mistakes INTEGER NOT NULL,
            games_lost INTEGER NOT NULL,
            best_score INTEGER NOT NULL,
            best_rating REAL NOT NULL,
            is_best_rating_ceiling INTEGER NOT NULL,
            best_time INTEGER NOT NULL,
            average_time REAL NOT NULL,
            hardcore_won INTEGER NOT NULL,
            challenges_won INTEGER NOT NULL,
            challenges_lost INTEGER NOT NULL
        )
    `
);

const createCompletedGamesTable = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`
        CREATE TABLE completed_games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            difficulty TEXT NOT NULL,
            encoded_state TEXT NOT NULL,
            rating REAL NOT NULL,
            is_rating_ceiling INTEGER NOT NULL,
            elapsed_time INTEGER NOT NULL,
            score INTEGER NOT NULL,
            mistakes INTEGER NOT NULL,
            max_mistakes INTEGER NOT NULL,
            completed_at INTEGER NOT NULL
        )
    `
);

const createCompletedGamesIndex = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`CREATE INDEX completed_games_difficulty_completed_at_index ON completed_games (difficulty, completed_at)`
);

const createPlayerStatsTable = Effect.flatMap(
    SqlClient.SqlClient,
    sql => sql`
        CREATE TABLE player_stats (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            technique_usage_counts TEXT NOT NULL DEFAULT '{}',
            daily_best_streak INTEGER NOT NULL DEFAULT 0,
            played_day_numbers TEXT NOT NULL DEFAULT '[]',
            daily_completed_day_numbers TEXT NOT NULL DEFAULT '[]'
        )
    `
);

const seedPlayerStats = Effect.flatMap(SqlClient.SqlClient, sql => sql`INSERT INTO player_stats (id) VALUES (1)`);

export const initialMigration = Effect.all(
    [
        createSettingsTable,
        createCustomThemesTable,
        createCurrentRunTable,
        createDifficultyStatsTable,
        createCompletedGamesTable,
        createCompletedGamesIndex,
        createPlayerStatsTable,
        seedPlayerStats
    ],
    { discard: true }
);
