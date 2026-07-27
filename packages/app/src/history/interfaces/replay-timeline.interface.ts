import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';

export interface ReplayTimelineInterface {
    events: GameTimelineEventInterface[];
    givens: string;
}
