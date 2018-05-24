class Box {
    private _height: number;
    private _width: number;

    constructor(_h: number, _w: number) {
        _h = _h || -Infinity;
        _w = _w || -Infinity;
        this._height = _h;
        this._width = _w;
    }

    public _doAllTheWork = () => {
        let i, j, count;
        const n = 10;
        for (i = 0; i < 10; i++) {
            for (j = 0; j < i; j++) {
                count += (i * j);
            }
        }
    };

    private _internalObject = {
        someInternalFunction: function () {

        }
    }

    public perimeter(): number {
        if (this._height == -Infinity) {
            return -Infinity;
        }
        return 2 * (this._height + this._width);
    }

    public area(): number {
        if (this._height == -Infinity) {
            return -Infinity;
        }
        return (this._height * this._width);
    }

    public toString(): string {
        return `Box { _height:${this._height}, _width:${this._width} }`;
    }
}
