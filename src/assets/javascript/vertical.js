class Vertical {
    constructor (origin, vector) {
        this.x = origin.x;
        this.y = origin.y;
        this.vector = vector; // vector = { r, theta }

        this.element = document.createElement('div');
        this.element.style.backgroundColor = "red";
        this.element.style.position = "absolute";
        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = `${this.y}px`;
        this.element.style.width = `${this.vector.r}px`;
        this.element.style.height = '1px';
        this.element.style.transformOrigin = "left bottom";
        this.element.style.transform = `rotate(${this.vector.theta}deg)`;
    }

    getOrigin () {
        return { Ox: this.Ox, Oy: this.Oy };
    }

    setOrigin (x, y) {
        this.x = x;
        this.y = y;

        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = `${this.y}px`;
    }

    setHeight (height) {
        this.vector.r = height;
        this.element.style.width = `${this.vector.r}px`;
    }

    getHeight () { // retorna a altura do vetor (vector.r)
        return this.vector.r;
    }

    getTop () { // retorna a posição (x, y) do topo da vertical
        return { x: this.x, y: this.y + this.vector.r }
    }
}

export default Vertical;