class Horizonte {
    constructor (w, h) {
        this.width = w;
        this.height = 1;

        this.x = 0;
        this.y = h;

        this.element = document.createElement('div');
        this.element.style.backgroundColor = "black";
        this.element.style.position = "absolute";
        this.element.style.width = `${this.w}px`;
        this.element.style.height = `${this.h}px`;
        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = `${this.y}px`;
    }

    getSize () {
        return { w: this.width, h: this.height };
    }

    getPosition () {
        return { x: this.x, y: this.y };
    }

    getElement () {
        return this.element;
    }
}

export default Horizonte;