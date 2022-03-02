import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlayerState } from 'src/app/models/gear-player-state.model';

@Component({
    selector: 'app-gear-player',
    templateUrl: './gear-player.component.html',
    styleUrls: ['./gear-player.component.scss'],
})
export class GearPlayerComponent {
    constructor() {}

    @Input() canBeActivated = false;

    @Output() sliderChanged: EventEmitter<number> = new EventEmitter();

    @Output() started: EventEmitter<PlayerState> = new EventEmitter();
    @Output() paused = new EventEmitter();
    @Output() stopped = new EventEmitter();

    sliderValue = 7;
    playerState = PlayerState.STOPPED;

    onSliderChange($event: number): void {
        this.sliderChanged.emit($event);
    }

    start(): void {
        if (this.canBeActivated) {
            this.started.emit(this.playerState);
            this.playerState = PlayerState.PLAYING;
        }
    }

    pause(): void {
        if (this.canBeActivated) {
            this.paused.emit();
            this.playerState = PlayerState.PAUSED;
        }
    }

    stop(): void {
        if (this.canBeActivated) {
            this.stopped.emit();
            this.playerState = PlayerState.STOPPED;
        }
    }

    isPlaying(): boolean {
        return this.playerState === PlayerState.PLAYING;
    }

    hasPaused(): boolean {
        return this.playerState === PlayerState.PAUSED;
    }

    hasStopped(): boolean {
        return this.playerState === PlayerState.STOPPED;
    }
}
