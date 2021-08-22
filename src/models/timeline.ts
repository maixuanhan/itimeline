import { ITimeline } from "./timeline.interface";

export class Timeline implements ITimeline {
    constructor(
        public start: number,
        public end: number,
    ) { }

    public isValid(): boolean {
        return this.start > 0 && this.start < this.end;
    }

    public getDuration(): number {
        return this.end - this.start;
    }

    public getRaw(): ITimeline {
        return {
            start: this.start,
            end: this.end,
        };
    }

    public clone(): Timeline {
        return new Timeline(this.start, this.end);
    }

    public isOverlap(other: ITimeline): boolean {
        return this.start < this.end && other.start <= this.start && this.start < other.end ||
            other.start < other.end && this.start <= other.start && other.start < this.end;
    }

    public getOverlap(other: ITimeline): Timeline {
        const start = Math.max(this.start, other.start);
        const end = Math.min(this.end, other.end);
        return end <= start ? new Timeline(0, 0) : new Timeline(start, end);
    }

    public getCover(other: ITimeline): Timeline {
        return new Timeline(Math.min(this.start, other.start), Math.max(this.end, other.end));
    }

    public isAdjacent(other: ITimeline): boolean {
        return this.end === other.start || this.start === other.end;
    }

    public getMerge(other: ITimeline): Timeline {
        if (this.isOverlap(other) || this.isAdjacent(other)) {
            return this.getCover(other);
        }

        return this.clone();
    }

    public getSubtract(other: ITimeline): Timeline[] {
        if (this.isOverlap(other)) {
            const overlap = this.getOverlap(other);
            const result: Timeline[] = [];

            if (this.start < overlap.start) {
                result.push(new Timeline(this.start, overlap.start));
            }

            if (this.end > overlap.end) {
                result.push(new Timeline(overlap.end, this.end));
            }

            return result;
        } else {
            return [this.clone()];
        }
    }
}
