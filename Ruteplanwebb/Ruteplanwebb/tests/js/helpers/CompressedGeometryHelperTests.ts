 ///<reference path="../../../ts/typings/jasmine/jasmine-1-3.d.ts"/>
 ///<reference path="../../../js/helpers/CompressedGeometryHelper.ts"/>
describe("fromStringRadix32 Tests", () => {
    it("+1lmo -> 55000", () => {
        expect(SVV.RutePlan.Helpers.CompressedGeometryHelper.fromStringRadix32("+1lmo")).toBe(55000);
    });

});

describe("compressedGeometry Tests", () => {
    it("+34+1lmo+0 -> [550 0]", () => {
        var res = SVV.RutePlan.Helpers.CompressedGeometryHelper.extractPointsFromCompressedGeometry("+34+1lmo+0");
        expect(res).toBeDefined();
        expect(res.length).toBe(1);
        expect(res[0].x).toBe(550);
        expect(res[0].y).toBe(0);
    });

    it("+0+1+1+34+1dukkk+b7co0o+9c+0+0+34-9c-34|+34+0+71+0+71", () => {
        var res = <SVV.RutePlan.Helpers.Xyz[]>SVV.RutePlan.Helpers.CompressedGeometryHelper.extractPointsFromCompressedGeometry("+0+1+1+34+1dukkk+b7co0o+9c+0+0+34-9c-34|+34+0+71+0+71");
        expect(res).toBeDefined();
        expect(res.length).toBe(4);
        expect(res[0].x).toBe(481901);
        expect(res[0].y).toBe(3768566);
        expect(res[0].z).toBe(0);

        expect(res[1].x).toBe(481904);
        expect(res[1].y).toBe(3768566);
        expect(res[1].z).toBe(2.25);

        expect(res[2].x).toBe(481904);
        expect(res[2].y).toBe(3768567);
        expect(res[2].z).toBe(2.25);

        expect(res[3].x).toBe(481901);
        expect(res[3].y).toBe(3768566);
        expect(res[3].z).toBe(4.5);
    });

});


