class Focus {
    constructor (x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    setOrigin (x, y) {
        this.x = x
        this.y = y
    }

    getOrigin () {
        return { x: this.x, y: this.y };
    }

    getVector (X, Y) {
        const tg = (Y - this.y) / (X - this.x)
        const thetaRad = Math.atan(tg);
        const theta = this.x > X ? thetaRad * (180 / Math.PI) + 180: thetaRad * (180 / Math.PI);
        const r = Math.sqrt(Math.pow((X - this.x), 2) + Math.pow((Y - this.y), 2));

        return { r, theta };
    }

    getSize () {
        return { w: 1, h: 1 };
    }

}

export default Focus;