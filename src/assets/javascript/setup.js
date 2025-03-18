const content = document.getElementById('content');

const verticalHeight = document.getElementById('vertical-height')
const verticalPosition = document.getElementById('vertical-position')
const horizontalPosition = document.getElementById('horizontal-position')
const focus1Position = document.getElementById('focus-position-1')
const focus2Position = document.getElementById('focus-position-2')

const Y_CENTER = (window.innerHeight / 2);
const X_CONTENT = (window.innerWidth - 300);

function setMaxFields () {
    verticalHeight.max = window.innerHeight
    verticalPosition.max = window.innerHeight
    verticalPosition.min = 0
    horizontalPosition.max = X_CONTENT
    focus1Position.max = X_CONTENT
    focus2Position.max = X_CONTENT
}

setMaxFields()

function createElement (color, width, height, left, bottom) {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.transformOrigin = 'left bottom';
    element.style.backgroundColor = color;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.left = `${left}px`;
    element.style.bottom = `${bottom}px`;
    return element
}

function getAngleBetweenLines (v1, v2) {
    const absoluteDotProduct = Math.abs((v1.a * v2.a) + (v1.b * v2.b));
    const moduleV1 = Math.sqrt(v1.a**2 + v1.b**2);
    const moduleV2 = Math.sqrt(v2.a**2 + v2.b**2);
    const angle = absoluteDotProduct / (moduleV1 * moduleV2);
    return angle;
}

function cosToDegree (cos) {
    const radian = Math.acos(cos);
    return (radian * (180 / Math.PI));
}

function tanToDegree (tan) {
    const radian = Math.atan(tan);
    return (radian * (180 / Math.PI));
}

class Point {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.element = createElement('red', 1, 1, this.x, this.y);
        this.render();
    }

    getPoint () {
        return { x: this.x, y: this.y };
    }

    setPoint (x, y) {
        this.x = x;
        this.y = y;
        this.render()
    }

    render () {
        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = `${this.y}px`;
    }
}

class Line {
    constructor (origin, destiny) {
        this.origin = new Point(origin.x, origin.y);
        this.destiny = new Point(destiny.x, destiny.y);
        this.director = this.getDirector();
        this.element = createElement('blue', this.getSize(), 1, this.origin.x, this.origin.y);
        this.angle = this.director.a === 0 ? 90 : tanToDegree(this.director.b / this.director.a);
        this.render();
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
        const { a, b } = this.getDirector();
        return Math.sqrt(a**2 + b**2);
    }

    getOrigin () {
        return { ...this.origin };
    }

    getDestiny () {
        return { ...this.destiny };
    }

    setOrigin (x, y) {
        this.origin = { x, y };
        this.director = this.getDirector();
        this.angle = this.director.a === 0 ? 90 : tanToDegree(this.director.b / this.director.a);
        this.render();
    }
    
    setDestiny (x, y) {
        this.destiny = { x, y };
        this.director = this.getDirector();
        this.angle = this.director.a === 0 ? 90 : tanToDegree(this.director.b / this.director.a);
        this.render();
    }

    render () {
        this.element.style.left = `${this.origin.x}px`;
        this.element.style.bottom = `${this.origin.y}px`;
        this.element.style.width = `${this.getSize()}px`;
        this.element.style.transform = `rotate(-${this.angle}deg)`;
    }
}

class PerspectiveScene {
    constructor (content) {
        this.horizonteLine = new Line({ x: 0, y: Y_CENTER}, { x: X_CONTENT, y: Y_CENTER});
        this.focus1 = new Point ({ x: 400, y: Y_CENTER });
        this.focus2 = new Point ({ x: X_CONTENT - 400, y: Y_CENTER });
        this.vertical = new Line(
            { x: X_CONTENT / 2, y: Y_CENTER - 100 },
            { x: X_CONTENT / 2, y: Y_CENTER }
        );

        content.append(this.horizonteLine.element);
        content.append(this.vertical.element);
        content.append(this.focus1.element);
        content.append(this.focus2.element);
    }

    updateVertical (x, y, size) {
        this.vertical.setOrigin(x, y);
        this.vertical.setDestiny(x, y + size);
    }

    render () {
        this.horizonteLine.render()
        this.vertical.render()
        this.focus1.render()
        this.focus2.render()
    }
}

const scene = new PerspectiveScene(content);

verticalHeight.addEventListener('input', (event) => {
    const verticalSize = parseInt(event.target.value)
    scene.updateVertical(scene.vertical.getOrigin().x, scene.vertical.getOrigin().y, verticalSize);
});

verticalPosition.addEventListener('input', (event) => {
    const fugay = parseInt(event.target.value)
    scene.updateVertical(scene.vertical.getOrigin().x, fugay, scene.vertical.getSize());
});

horizontalPosition.addEventListener('input', (event) => {
    const fugax = parseInt(event.target.value)
    scene.updateVertical(fugax, scene.vertical.getOrigin().y, scene.vertical.getSize());
});

focus1Position.addEventListener('input', (event) => {
    const fugax = parseInt(event.target.value);
    scene.updateFocus({ x: fugax, y: Y_CENTER }, 0);
});

focus2Position.addEventListener('input', (event) => {
    const fugax = parseInt(event.target.value);
    scene.updateFocus({ x: fugax, y: Y_CENTER }, 1);
});
