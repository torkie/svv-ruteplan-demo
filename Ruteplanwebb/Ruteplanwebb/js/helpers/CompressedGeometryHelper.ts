module SVV.RoutePlanning.Helpers {

    export class Xy {
        x: number;
        y: number;
    }

    export class Xyz extends Xy {
        z: number;
    }

    export class CompressedGeometryHelper {

        static mAbc: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v'];


        public static extractPointsFromCompressedGeometry(compresedGeometry: string): Xy[] {
            // initialize result storage
            var points = new Array();
            var flags = 0;

            var nIndexXy = [0];
            var nIndexZ = [0];
            var dMultByXy;
            var dMultByZ = 0;

            // Versions before 9.3 doesn't have support for z. 
            // If first element is 0 we can harvest z from the compressed geometry
            var firstElement = CompressedGeometryHelper.extractInt(compresedGeometry, nIndexXy);
            if (firstElement == 0) //post 9.3 format
            {
                var version = CompressedGeometryHelper.extractInt(compresedGeometry, nIndexXy);
                flags = CompressedGeometryHelper.extractInt(compresedGeometry, nIndexXy);
                dMultByXy = CompressedGeometryHelper.extractInt(compresedGeometry, nIndexXy);
            } else
                dMultByXy = firstElement;
            var nLength: number;
            if (flags == 0)
                nLength = compresedGeometry.length; // reduce call stack
            else {
                nLength = compresedGeometry.indexOf('|');
                if ((flags & 1) == 1) //has Zs
                {
                    nIndexZ[0] = nLength + 1;
                    dMultByZ = CompressedGeometryHelper.extractInt(compresedGeometry, nIndexZ);
                }
            }
            var nLastDiffX = 0;
            var nLastDiffY = 0;
            var nLastDiffZ = 0;
            while (nIndexXy[0] != nLength) {
                //X
                var nDiffX = CompressedGeometryHelper.extractInt(compresedGeometry, nIndexXy);
                var nX = nDiffX + nLastDiffX; // decompress
                nLastDiffX = nX;
                var dX = nX / dMultByXy;
                //Y
                var nDiffY = CompressedGeometryHelper.extractInt(compresedGeometry, nIndexXy);
                var nY = nDiffY + nLastDiffY; // decompress
                nLastDiffY = nY;
                var dY = nY / dMultByXy;

                if ((flags & 1) == 1) //has Zs
                { //Z
                    var nDiffZ = CompressedGeometryHelper.extractInt(compresedGeometry, nIndexZ);
                    var nZ = nDiffZ + nLastDiffZ; // decompress
                    nLastDiffZ = nZ;
                    var dZ = nZ / dMultByZ;

                    var point = new Xyz();
                    point.x = dX;
                    point.y = dY;
                    point.z = dZ;

                    // add result item
                    points.push(point);
                } else {
                    var pointXy = new Xy();
                    pointXy.x = dX;
                    pointXy.y = dY;

                    // add result item
                    points.push(pointXy);
                }
            }

            return points;
        }

        // Read one integer from compressed geometry string by using passed position
        // Returns extracted integer, and re-writes nStartPos for the next integer
        public static extractInt = (src: string, nStartPos: number[]) => {
            var bStop = false;
            var result = "";
            var nCurrentPos = nStartPos[0];
            while (!bStop) {
                var cCurrent = src[nCurrentPos];
                if (cCurrent == '+' || cCurrent == '-' || cCurrent == '|') {
                    if (nCurrentPos != nStartPos[0]) {
                        bStop = true;
                        continue;
                    }
                }
                result += cCurrent;
                nCurrentPos++;
                if (nCurrentPos == src.length) // check overflow
                    bStop = true;
            }
            var nResult = -1e8;
            if (result.length != 0) {
                nResult = CompressedGeometryHelper.fromStringRadix32(result);
                nStartPos[0] = nCurrentPos;
            }
            return nResult;
        }

        // Sample input and output: +1lmo -> 55000
        public static fromStringRadix32 = (s: string): number => {
            var result = 0;
            for (var i = 1; i < s.length; i++) {
                var cur = s[i];

                //Assert((cur >= '0' && cur <= '9') || (cur >= 'a' && cur <= 'v'));
                if (cur >= '0' && cur <= '9')
                    result = (result << 5) + cur.charCodeAt(0) - '0'.charCodeAt(0);
                else if (cur >= 'a' && cur <= 'v')
                    result = (result << 5) + cur.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
                else throw new RangeException(); // exception
            }
            if (s[0] == '-')
                result = -result;
            else if (s[0] != '+')
                throw new RangeException();
            return result;
        }
    }
}
