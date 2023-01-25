class Canvas {
    constructor(container) {
        this.element = document.createElement("canvas");
        this.context = this.element.getContext("2d");

        this.element.width = 400;
        this.element.height = 400;

        container.appendChild(this.element)
    }
}

export default Canvas;