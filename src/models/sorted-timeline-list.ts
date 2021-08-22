import { Timeline } from "./timeline";
import { ITimeline } from "./timeline.interface";

export class SortedTimelineList {
    private list: Timeline[] = [];
    private mergeStrategy = false;

    constructor(strategy: "keep" | "merge") {
        this.mergeStrategy = strategy === "merge";
    }

    public get(): Timeline[] {
        return this.list;
    }

    public getRaw(): ITimeline[] {
        return this.list.map((r) => r.getRaw());
    }

    public add(...timelines: Timeline[]): SortedTimelineList {
        if (timelines.length > 0) {
            this.list.push(...timelines);
            this.sortList();
        }

        return this;
    }

    public keepOverlap(...timelines: Timeline[]): SortedTimelineList {
        if (timelines.length > 0) {
            const targetList: Timeline[] = [];
            timelines.forEach((r) => {
                this.list.forEach((s) => {
                    const overlap = s.getOverlap(r);
                    targetList.push(overlap);
                });
            });
            this.list.splice(0, this.list.length, ...targetList.filter((r) => r.isValid()));
            this.sortList();
        }
        return this;
    }

    public subtract(...timelines: Timeline[]): SortedTimelineList {
        if (timelines.length > 0) {
            const targetList: Timeline[] = [];
            this.list.forEach((r) => {
                timelines.forEach((s) => {
                    const result = r.getSubtract(s);
                    targetList.push(...result);
                });
            });
            this.list.splice(0, this.list.length, ...targetList.filter((r) => r.isValid()));
            this.sortList();
        }
        return this;
    }

    private sortList(): SortedTimelineList {
        this.list.sort((a, b) => a.start - b.start);

        if (this.mergeStrategy) {
            let i = 0;

            while (i < this.list.length - 1) {
                let j = i + 1;

                while (j < this.list.length &&
                    (
                        this.list[i].isAdjacent(this.list[j]) ||
                        this.list[i].isOverlap(this.list[j])
                    )
                ) {
                    ++j;
                }

                if (j > i + 1) {
                    const merged = this.list[i].getCover(this.list[j - 1]);
                    this.list.splice(i, j - i, merged);
                } else {
                    ++i;
                }
            }
        }

        return this;
    }
}
