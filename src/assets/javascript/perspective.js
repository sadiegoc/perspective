const content = document.getElementById('content');

const verticalHeight = document.getElementById('vertical-height')
const verticalPosition = document.getElementById('vertical-position')
const horizontalPosition = document.getElementById('horizontal-position')
const focus1Position = document.getElementById('focus-position-1')
const focus2Position = document.getElementById('focus-position-2')

const Y_CENTER = (window.innerHeight / 2)
const X_CONTENT = (window.innerWidth - 300)

function createElement (color, position, width, height) {
    const element = document.createElement('div');
    element.style.backgroundColor = color;
    element.style.position = position;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    return element
}

class Focus {
    constructor (x, y) {
        this.x = x
        this.y = y
        this.element = createElement('red', 'absolute', 2, 2);
        this.updateFocus(this.x, this.y);
        this.render();
    }

    updateFocus (x, y) {
        this.x = x;
        this.y = y;
        this.render();
    }

    render () {
        this.element.style.left = `${this.x}px`
        this.element.style.bottom = `${this.y}px`
    }
}

class Vertical {
    constructor (x, y, length) {
        this.x = x;
        this.y = y;
        this.length = length;

        this.element = createElement('red', 'absolute', this.length, 2);
        this.element.style.left = `${this.x}px`
        this.element.style.bottom = `${this.y}px`
        this.element.style.transformOrigin = "bottom left";
        this.element.style.transform = `rotate(-90deg)`;
    }

    updatePosition (length) {
        this.length = length;
    }

    render () {
        this.element.style.left = `${this.x}px`
        this.element.style.bottom = `${this.y}px`
        this.element.style.width = `${this.length}px`
    }
}

class Vector {
    constructor (focus, vertical) {
        this.focus = focus;
        this.vertical = vertical;
        this.vector = this.calculateVector(this.focus, this.vertical);

        this.element = createElement('blue', 'absolute', this.vector.r, 1);
        this.element.style.left = `${this.focus.x}px`
        this.element.style.bottom = `${this.focus.y}px`
        this.render();
    }

    calculateVector (focus, vertical) {
        const x = focus.x;
        const y = focus.y;
        const x1 = vertical.x;
        const y1 = vertical.y;

        const vectorPolar = this.calculatePolar(x, y, x1, y1)
        return vectorPolar;
    }

    calculatePolar (x, y, x1, y1) {
        const t = (y1 - y) / (x1 - x)
        const tRad = Math.atan(t);
        let theta = tRad * (180 / Math.PI);
        theta = x < x1 ? theta : theta + 180
        return {
            r: Math.sqrt(Math.pow((x1 - x), 2) + Math.pow((y1 - y), 2)),
            theta: theta
        };
    }

    render () {
        this.element.style.left = `${this.focus.x}px`
        this.element.style.bottom = `${this.focus.y}px`
        this.element.style.transformOrigin = "bottom left";
        this.element.style.width = `${this.vector.r}px`;
        this.element.style.transform = `rotate(${-this.vector.theta}deg)`;
    }
}

class PerspectiveScene {
    constructor (content) {
        this.content = content;
        this.focus1 = new Focus(0, Y_CENTER);
        this.focus2 = new Focus(X_CONTENT, Y_CENTER);
        this.vertical = new Vertical(500, 240, 350);
        this.horizontal = this.startHorizontal()

        this.vectorsTop = [
            new Vector(this.focus1, { x: this.vertical.x, y: this.vertical.y + this.vertical.length }),
            new Vector(this.focus2, { x: this.vertical.x, y: this.vertical.y + this.vertical.length }),
        ]

        this.vectorsBottom = [
            new Vector(this.focus1, { x: this.vertical.x, y: this.vertical.y }),
            new Vector(this.focus2, { x: this.vertical.x, y: this.vertical.y }),
        ];

        verticalHeight.max = window.innerHeight
        verticalPosition.max = window.innerHeight
        verticalPosition.min = -window.innerHeight
        horizontalPosition.max = X_CONTENT
        focus1Position.max = X_CONTENT
        focus2Position.max = X_CONTENT

        verticalHeight.value = this.vertical.length
        verticalPosition.value = this.vertical.y
        horizontalPosition.value = this.vertical.x
        focus1Position.value = this.focus1.x
        focus2Position.value = this.focus2.x;

        this.content.append(this.focus1.element)
        this.content.append(this.focus2.element)
        this.content.append(this.vertical.element)
        this.content.append(this.horizontal)

        this.updateScene();
        this.vectorsTop.forEach(vector => this.content.append(vector.element))
        this.vectorsBottom.forEach(vector => this.content.append(vector.element))

    }

    calculateSideVertical (focus) {
        
    }

    startHorizontal () {
        const horizontal = createElement('black', 'absolute', X_CONTENT, 2);
        horizontal.style.left = '0px';
        horizontal.style.bottom = `${Y_CENTER}px`;
        return horizontal
    }

    updateScene () {
        this.render();
    }

    render () {
        this.vertical.render();

        this.vectorsTop.forEach(vector => {
            vector.vector = vector.calculateVector(vector.focus, {...this.vertical, y: this.vertical.y + this.vertical.length});
            vector.render();
        });

        this.vectorsBottom.forEach(vector => {
            vector.vector = vector.calculateVector(vector.focus, this.vertical);
            vector.render();
        });
    }

    updateVertical (x, y, verticalSize) {
        this.vertical.x = x
        this.vertical.y = y
        this.vertical.updatePosition(verticalSize);
        this.render();
    }

    updateFocus (focus1, focus2) {
        this.focus1.updateFocus(focus1.x, Y_CENTER);
        this.focus2.updateFocus(focus2.x, Y_CENTER);
        this.render();
    }
}

const scene = new PerspectiveScene(content);

verticalHeight.addEventListener('input', (event) => {
    const verticalSize = parseInt(event.target.value)
    scene.updateVertical(scene.vertical.x, scene.vertical.y, verticalSize);
});

verticalPosition.addEventListener('input', (event) => {
    const fugay = parseInt(event.target.value)
    scene.updateVertical(scene.vertical.x, fugay, scene.vertical.length);
});

horizontalPosition.addEventListener('input', (event) => {
    const fugax = parseInt(event.target.value)
    scene.updateVertical(fugax, scene.vertical.y, scene.vertical.length);
});

focus1Position.addEventListener('input', (event) => {
    const fugax = parseInt(event.target.value);
    scene.updateFocus({ x: fugax, y: scene.focus1.y }, scene.focus2)
});

focus2Position.addEventListener('input', (event) => {
    const fugax = parseInt(event.target.value);
    scene.updateFocus(scene.focus1, { x: fugax, y: scene.focus2.y })
});