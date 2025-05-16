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
    horizontalPosition.max = X_CONTENT
    focus1Position.max = X_CONTENT
    focus2Position.max = X_CONTENT
}

function setFirstSettings () {
    focus1Position.value = 100;
    focus2Position.value = X_CONTENT - 100;
    horizontalPosition.value = X_CONTENT / 2;
    verticalPosition.value = Y_CENTER - 200
    verticalHeight.value = 300
}

setMaxFields()
setFirstSettings()

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
    constructor (origin, destiny, color) {
        this.origin = new Point(origin.x, origin.y);
        this.destiny = new Point(destiny.x, destiny.y);
        this.director = this.getDirector();
        this.element = createElement(color, this.getSize(), 2, this.origin.x, this.origin.y);
        this.angle = this.getAngle()
        this.render();
    }

    getAngle () {
        if (this.destiny.x >= this.origin.x)
            return this.director.a === 0 ? -90 : -tanToDegree(this.director.b / this.director.a);
        else return -tanToDegree(this.director.b / this.director.a) + 180;
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
        return { x: this.origin.x, y: this.origin.y };
    }

    getDestiny () {
        return { x: this.destiny.x, y: this.destiny.y };
    }

    setOrigin (x, y) {
        this.origin = { x, y };
        this.director = this.getDirector();
        this.angle = this.getAngle();
        this.render();
    }
    
    setDestiny (x, y) {
        this.destiny = { x, y };
        this.director = this.getDirector();
        this.angle = this.getAngle();
        this.render();
    }

    render () {
        this.element.style.left = `${this.origin.x}px`;
        this.element.style.bottom = `${this.origin.y}px`;
        this.element.style.width = `${this.getSize()}px`;
        this.element.style.transform = `rotate(${this.angle}deg)`;
    }
}

class PerspectiveScene {
    constructor (content) {
        this.horizonte = new Line({ x: 0, y: Y_CENTER}, { x: X_CONTENT, y: Y_CENTER}, 'black');
        this.focus1 = new Point (100, Y_CENTER );
        this.focus2 = new Point (X_CONTENT - 100, Y_CENTER );
        this.vertical = new Line(
            { x: X_CONTENT / 2, y: Y_CENTER - 200 },
            { x: X_CONTENT / 2, y: Y_CENTER + 100 },
            'black'
        );

        
        this.line1 = new Line(this.focus1.getPoint(), this.vertical.getOrigin(), 'red');
        this.line2 = new Line(this.focus1.getPoint(), this.vertical.getDestiny(), 'green');
        this.line3 = new Line(this.focus2.getPoint(), this.vertical.getOrigin(), 'gold');
        this.line4 = new Line(this.focus2.getPoint(), this.vertical.getDestiny(), 'darkorange');

        content.append(this.horizonte.element);
        content.append(this.vertical.element);
        content.append(this.focus1.element);
        content.append(this.focus2.element);

        content.append(this.line1.element);
        content.append(this.line2.element);
        content.append(this.line3.element);
        content.append(this.line4.element);
    }

    updateVertical (x, y, size) {
        this.vertical.setOrigin(x, y);
        this.vertical.setDestiny(x, y + size);
        this.updateLines();
    }

    updateFocus (focus1, focus2) {
        this.focus1.setPoint(focus1.x, focus1.y);
        this.focus2.setPoint(focus2.x, focus2.y);
        this.updateLines();
    }

    updateLines () {
        this.line1.setOrigin(this.focus1.getPoint().x, this.focus1.getPoint().y);
        this.line1.setDestiny(this.vertical.getOrigin().x, this.vertical.getOrigin().y);
        
        this.line2.setOrigin(this.focus1.getPoint().x, this.focus1.getPoint().y);
        this.line2.setDestiny(this.vertical.getDestiny().x, this.vertical.getDestiny().y);
        
        this.line3.setOrigin(this.focus2.getPoint().x, this.focus2.getPoint().y);
        this.line3.setDestiny(this.vertical.getOrigin().x, this.vertical.getOrigin().y);
        
        this.line4.setOrigin(this.focus2.getPoint().x, this.focus2.getPoint().y);
        this.line4.setDestiny(this.vertical.getDestiny().x, this.vertical.getDestiny().y);
    }

    render () {
        this.horizonte.render()
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
    scene.updateFocus(
        { x: fugax, y: Y_CENTER },
        { x: scene.focus2.x, y: scene.focus2.y },
    );
});
    
focus2Position.addEventListener('input', (event) => {
    const fugax = parseInt(event.target.value);
    scene.updateFocus(
        { x: scene.focus1.x, y: scene.focus1.y },
        { x: fugax, y: Y_CENTER },
    );
});
