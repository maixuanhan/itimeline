import { assert, expect, should } from "chai";
import * as moment from "moment";
import { Timeline } from "../../src/models/timeline";
import { ITimeline } from "../../src/models/timeline.interface";

describe("Timeline object", function () {
    it("Timeline should be constructed", function () {
        const start = moment().valueOf();
        const end = moment().add(2, "hours").valueOf();
        const a = new Timeline(start, end);
        assert.equal(a.start, start);
        assert.equal(a.end, end);
    });
    it("Test .isValid()", function () {
        assert.isFalse(new Timeline(0, 1).isValid());
        assert.isFalse(new Timeline(-1, 1).isValid());
        assert.isFalse(new Timeline(10, 10).isValid());
        assert.isFalse(new Timeline(10, 9).isValid());
        assert.isTrue(new Timeline(10, 11).isValid());
    });
    it("Test .getDuration()", function () {
        assert.equal(new Timeline(10, 21).getDuration(), 21 - 10);
        assert.equal(new Timeline(0, 1).getDuration(), 1 - 0);
        assert.equal(new Timeline(-1, 1).getDuration(), 1 - -1);
        assert.equal(new Timeline(10, 10).getDuration(), 10 - 10);
        assert.equal(new Timeline(10, 9).getDuration(), 9 - 10);
        assert.equal(new Timeline(10, 11).getDuration(), 11 - 10);
    });
    it("Test .getRaw()", function () {
        const raw: ITimeline = { start: 10, end: 21 };
        assert.deepStrictEqual(new Timeline(10, 21).getRaw(), raw);
    });
    it("Test .clone()", function () {
        const a = new Timeline(10, 21);
        const b = a.clone();
        assert.notEqual(a, b);
        assert.deepStrictEqual(a.getRaw(), b.getRaw());
    });
    it("Timelines should be overlaped", function () {
        assert.isTrue(new Timeline(10, 21).isOverlap(new Timeline(10, 21)));
        assert.isTrue(new Timeline(10, 21).isOverlap(new Timeline(10, 22)));
        assert.isTrue(new Timeline(10, 21).isOverlap(new Timeline(9, 21)));
        assert.isTrue(new Timeline(10, 21).isOverlap(new Timeline(9, 22)));
        assert.isTrue(new Timeline(10, 21).isOverlap(new Timeline(11, 21)));
        assert.isTrue(new Timeline(10, 21).isOverlap(new Timeline(10, 20)));
        assert.isTrue(new Timeline(10, 21).isOverlap(new Timeline(11, 20)));
    });
    it("Timelines should not be overlaped", function () {
        assert.isFalse(new Timeline(10, 21).isOverlap(new Timeline(21, 30)));
        assert.isFalse(new Timeline(10, 21).isOverlap(new Timeline(22, 30)));
        assert.isFalse(new Timeline(10, 21).isOverlap(new Timeline(1, 9)));
        assert.isFalse(new Timeline(10, 21).isOverlap(new Timeline(1, 10)));
    });
});