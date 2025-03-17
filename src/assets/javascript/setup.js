const Y_CENTER = (window.innerHeight / 2)
const X_CONTENT = (window.innerWidth - 300)

class Point {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    getPoint () {
        return { x: this.x, y: this.y };
    }

    setPoint (x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    constructor (origin, destiny) {
        this.origin = new Point(origin);
        this.destiny = new Point(destiny);
        this.director = getDirector(this.origin, this.destiny);
    }

    getDirector () {
        return {
            a: this.destiny.x - this.origin.x,
            b: this.destiny.y - this.origin.y
        };
    }

    getPosition (t) {
        return {
            x: this.origin.x + this.director.a * t,
            y: this.origin.y + this.director.b * t
        };
    }

    getReducedEquation () {
        return {
            x: (y) => this.origin.x + (this.director.a * (y - this.origin.y)),
            y: (x) => this.origin.y + (this.director.b * (x - this.origin.x))
        };
    }

    getSize () {
        const { x, y } = this.getDirector();
        return Math.sqrt(x**2 + y**2);
    }

    getOrigin () {
        return { ...this.origin };
    }

    getDestiny () {
        return { ...this.destiny };
    }

    setOrigin (origin) {
        this.origin = origin;
        this.director = this.getDirector();
    }
    
    setDestiny (destiny) {
        this.destiny = destiny;
        this.director = this.getDirector();
    }
}

function createElement (color, position, width, height, left, bottom) {
    const element = document.createElement('div');
    element.style.backgroundColor = color;
    element.style.position = position;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.left = `${left}px`;
    element.style.bottom = `${bottom}px`;
    return element
}

class Vector {
    constructor (focus, point) {
        this.focus = focus;
        this.point = point;
        this.vector = this.calculateVector();

        this.element = createElement('blue', 'absolute', this.vector.r, 1, this.focus.x, this.focus.y);
        this.render();
    }

    updateVector (focus, point) {
        this.focus = focus
        this.point = point
        this.vector = this.calculateVector()
        this.render();
    }

    calculateVector () {
        const Xo = this.focus.x
        const Yo = this.focus.y
        const x = this.point.x
        const y = this.point.y

        const vectorPolar = this.calculatePolar(Xo, Yo, x, y);
        return vectorPolar;
    }

    getYByX (x) {
        const tg = Math.tan((this.vector.theta * (Math.PI / 180)))
        const y = Math.abs(x - this.focus.x) * tg;
        return y
    }

    calculatePolar (Xo, Yo, x, y) {
        const t = (y - Yo) / (x - Xo)
        const tRad = Math.atan(t);
        let theta = tRad * (180 / Math.PI);
        theta = Xo < x ? theta : theta + 180
        return {
            r: Math.sqrt(Math.pow((x - Xo), 2) + Math.pow((y - Yo), 2)),
            theta: theta
        };
    }

    render () {
        this.element.style.left = `${this.focus.x}px`;
        this.element.style.bottom = `${this.focus.y}px`;
        this.element.style.transformOrigin = "bottom left";
        this.element.style.width = `${this.vector.r}px`;
        this.element.style.transform = `rotate(${-this.vector.theta}deg)`;
    }
}

class Vertical {
    constructor (Xo, Yo, t) {
        this.Xo = Xo
        this.Yo = Yo
        this.t = t
        this.vertical = { origin: this.getOrigin(), point: this.getPoint() };
        this.focusList = []

        this.element = createElement('red', 'absolute', 1, this.t, this.Xo, this.Yo);
        this.render();
    }

    update () {
        this.focusList.forEach(focus => {
            focus.updateVertical(this.vertical);
        })
        this.render();
    }

    appendFocus (focus) {
        this.focusList.push(new Focus(focus.x, focus.y, this.vertical));
    }

    setPosition (Xo, Yo, t) {
        this.Xo = Xo
        this.Yo = Yo
        this.t = t
        this.vertical = { origin: this.getOrigin(), point: this.getPoint() }
        this.update()
    }

    getOrigin () {
        return { x: this.Xo, y: this.Yo };
    }

    getPoint () {
        return { x: this.Xo, y: this.Yo + this.t };
    }

    render () {
        this.element.style.height = `${this.t}px`;
        this.element.style.left = `${this.Xo}px`;
        this.element.style.bottom = `${this.Yo}px`;
    }
}

class Focus {
    constructor (x, y, vertical) {
        this.x = x
        this.y = y
        this.vertical = vertical
        this.secondayVertical = vertical
        this.vectors = [
            new Vector({ x: this.x, y: this.y }, this.vertical.origin),
            new Vector({ x: this.x, y: this.y }, this.vertical.point),
            // new Vector({ x: this.x, y: this.y }, this.secondayVertical.origin),
            // new Vector({ x: this.x, y: this.y }, this.secondayVertical.point),
        ]
        this.element = createElement('red', 'absolute', 2, 2, this.x, this.y)
    }

    update () {
        this.updateVectors();
        this.render();
    }

    setPosition (x, y) {
        this.y = y
        this.x = x
        this.update()
    }

    updateVertical (vertical) {
        this.vertical = vertical;
        
        this.update()
    }

    updateVectors () {
        // console.log(this.vertical.origin.x - 80, this.vectors[0].getYByX(this.vertical.origin.x - 80))
        this.vectors[0].updateVector({ x: this.x, y: this.y }, this.vertical.origin)
        this.vectors[1].updateVector({ x: this.x, y: this.y }, this.vertical.point)
        // this.vectors[2].updateVector({ x: this.x, y: this.y }, {
        //     x: this.vertical.origin.x,
        //     y: this.x > this.vertical.origin.x ? this.vectors[0].getYByX(this.vertical.origin.x + 100) : this.vectors[0].getYByX(this.vertical.origin.x - 100)
        // })

        // this.vectors[3].updateVector({ x: this.x, y: this.y }, {
        //     x: this.vertical.point.x,
        //     y: this.x > this.vertical.point.x ? this.vectors[0].getYByX(this.vertical.point.x + 100) : this.vectors[0].getYByX(this.vertical.point.x - 100)
        // })
    }

    render () {
        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = `${this.y}px`;
    }
}

class PerspectiveScene {
    constructor (content) {
        // this.content = content;
        // this.vertical = new Vertical(400, 300, 350); // x=400, y=300, l=350
        // this.vertical.appendFocus({ x: 0, y: Y_CENTER });
        // this.vertical.appendFocus({ x: X_CONTENT, y: Y_CENTER });
        // this.horizontal = createElement('black', 'absolute', X_CONTENT, 2, 0, Y_CENTER);

        // this.content.append(this.vertical.element);
        // this.content.append(this.horizontal);
        // this.vertical.focusList.forEach(focus => {
        //     focus.vectors.forEach(v => this.content.append(v.element));
        //     this.content.append(focus.element);
        // });

        this.horizonteLine = new Line({ x: 0, y: Y_CENTER}, { x: X_CONTENT, y: Y_CENTER});
        this.focus1 = new Point ({ x: 400, y: Y_CENTER });
        this.focus2 = new Point ({ x: X_CONTENT - 400, y: Y_CENTER });

        this.vertical = new Line(
            { x: X_CONTENT / 2, y: Y_CENTER - 400 },
            { x: X_CONTENT / 2, y: Y_CENTER + 400 }
        );
    }

    getAngleBetweenLines (v1, v2) {
        const absoluteDotProduct = Math.abs((v1.a * v2.a) + (v1.b * v2.b));
        const moduleV1 = Math.sqrt(v1.x**2 + v1.y**2);
        const moduleV2 = Math.sqrt(v2.x**2 + v2.y**2);
        const angle = absoluteDotProduct / (moduleV1 * moduleV2);
        return angle;
    }
}

const content = document.getElementById('content');
const scene = new PerspectiveScene(content);

const verticalHeight = document.getElementById('vertical-height')
const verticalPosition = document.getElementById('vertical-position')
const horizontalPosition = document.getElementById('horizontal-position')
const focus1Position = document.getElementById('focus-position-1')
const focus2Position = document.getElementById('focus-position-2')

function setMaxFields () {
    verticalHeight.max = window.innerHeight
    verticalPosition.max = window.innerHeight
    verticalPosition.min = -window.innerHeight
    horizontalPosition.max = X_CONTENT
    focus1Position.max = X_CONTENT
    focus2Position.max = X_CONTENT
}

setMaxFields()

verticalHeight.addEventListener('input', (event) => {
    const verticalSize = parseInt(event.target.value)
    scene.updateVertical(scene.vertical.Xo, scene.vertical.Yo, verticalSize);
});

verticalPosition.addEventListener('input', (event) => {
    const fugay = parseInt(event.target.value)
    scene.updateVertical(scene.vertical.Xo, fugay, scene.vertical.t);
});

horizontalPosition.addEventListener('input', (event) => {
    const fugax = parseInt(event.target.value)
    scene.updateVertical(fugax, scene.vertical.Yo, scene.vertical.t);
});

focus1Position.addEventListener('input', (event) => {
    const fugax = parseInt(event.target.value);
    scene.updateFocus({ x: fugax, y: Y_CENTER }, 0);
});

focus2Position.addEventListener('input', (event) => {
    const fugax = parseInt(event.target.value);
    scene.updateFocus({ x: fugax, y: Y_CENTER }, 1);
});