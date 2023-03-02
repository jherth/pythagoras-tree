const sizeSlider = document.getElementById("size-slider");
const amountSlider = document.getElementById("amount-slider");
const xOffsetSlider = document.getElementById("xoffset-slider");
const yOffsetSlider = document.getElementById("yoffset-slider");

const canvasContainer = document.getElementById("canvas-container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let SIZE = 200; // The size of the rectangle
let AMOUNT = 8; // The amount of rectangles drawn
let X_OFFSET = 0; // The triangle top point x-offset
let Y_OFFSET = 0; // The triangle top point y-offset

onresize = () => updateCanvas();

/** Updates the canvas width and height and calculates the starting rectangle */
function updateCanvas() {
    // Initialize the width and height of the canvas
    ctx.canvas.width = canvasContainer.clientWidth;
    ctx.canvas.height = canvasContainer.clientHeight;

    // Calculate the starting rectangle points
    const startingPoints = [
        { x: (canvasContainer.clientWidth / 2) - (SIZE / 2), y: canvasContainer.clientHeight },
        { x: (canvasContainer.clientWidth / 2) + (SIZE / 2), y: canvasContainer.clientHeight }
    ];
    drawTree(startingPoints);
}

/**
 * Draws the pythagoras tree
 * @param {*} startingPoints The starting bottom points of the first rectangle 
 */
function drawTree(startingPoints) {
    // Draw the default rectangle
    const topPoints = drawRectangle(startingPoints);

    // Draw the rest of the tree recursively
    drawTreeRecursive(topPoints, AMOUNT);
}

/**
 * Draws the pythagoras tree recursively
 * @param {*} topPoints The top points of the rectangle
 * @param {*} amount The current amount left of steps to draw 
 */
function drawTreeRecursive(topPoints, amount) {
    if (amount <= 0) return;

    let trianglePoint = calculateTrianglePoint(topPoints);
    const topPointsLeft = drawRectangle([topPoints[0], trianglePoint]);
    drawTreeRecursive(topPointsLeft, amount - 1);

    trianglePoint = calculateTrianglePoint(topPoints);
    const topPointsRight = drawRectangle([trianglePoint, topPoints[1]]);
    drawTreeRecursive(topPointsRight, amount - 1);
}

/**
 * Draws a line between two points
 * @param {*} point1 The first point of the line
 * @param {*} point2 The second point of the line
 * eg: [{ x: 0, y: 0 }, { x: 10, y: 10 }]
 */
function drawLine([point1, point2]) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
    ctx.closePath();
}

/**
 * Draws a rectangle between the given points
 * @param {*} pointBottomLeft The bottom left point of the rectangle
 * @param {*} pointBottomRight The bottom right point of the rectangle
 * eg: [{ x: 0, y: 10 }, { x: 10, y: 10 }]
 * 
 * @returns The top points
 */
function drawRectangle([pointBottomLeft, pointBottomRight]) {
    // Draw bottom line
    drawLine([pointBottomLeft, pointBottomRight]);

    // Draw right line
    const vecRight = { x: pointBottomLeft.y - pointBottomRight.y, y: pointBottomLeft.x - pointBottomRight.x };
    const pointTopRight = { x: pointBottomRight.x - vecRight.x, y: pointBottomRight.y + vecRight.y };
    drawLine([pointBottomRight, pointTopRight]);

    // Draw left line
    const vecLeft = { x: pointBottomRight.y - pointBottomLeft.y, y: -(pointBottomRight.x - pointBottomLeft.x) };
    const pointTopLeft = { x: pointBottomLeft.x + vecLeft.x, y: pointBottomLeft.y + vecLeft.y };
    drawLine([pointBottomLeft, pointTopLeft]);

    // Draw top line
    drawLine([pointTopLeft, pointTopRight]);


    return [pointTopLeft, pointTopRight];
}

/**
 * Calculates the third point of the triangle, depending on the given points
 * @param {*} points The two points of the triangle
 * @returns The coordinates of the third point
 */
function calculateTrianglePoint(points) {
    const vecRightMiddle = {
        x: (points[1].x - points[0].x) / 2,
        y: (points[1].y - points[0].y) / 2
    };

    const middlePoint = {
        x: points[0].x + vecRightMiddle.x,
        y: points[0].y + vecRightMiddle.y
    };

    const vecOrthogonal = {
        x: -(middlePoint.y - points[1].y),
        y: middlePoint.x - points[1].x
    };

    const topPoint = {
        x: middlePoint.x + vecOrthogonal.x - X_OFFSET,
        y: middlePoint.y + vecOrthogonal.y - Y_OFFSET
    };

    return topPoint;
}

/**
 * Changes the current size of the rectangles drawn
 * @param {*} value The new size
 */
function changeSize(value) {
    sizeSlider.labels[0].textContent = `Rectangle Size: ${value}`;
    SIZE = value;
    updateCanvas();
}

/**
 * Changes the current amount of the rectangles drawn
 * @param {*} value 
 */
function changeAmount(value) {
    amountSlider.labels[0].textContent = `Rectangle Amount: ${value}`;
    AMOUNT = value;
    updateCanvas();
}

/**
 * Changes the current x-offset of the top triangle point
 * @param {*} value 
 */
function changeXOffset(value) {
    xOffsetSlider.labels[0].textContent = `X-Offset: ${value}`;
    X_OFFSET = value;
    updateCanvas();
}

/**
 * Changes the current y-offset of the top triangle point
 * @param {*} value 
 */
function changeYOffset(value) {
    yOffsetSlider.labels[0].textContent = `Y-Offset: ${value}`;
    Y_OFFSET = value;
    updateCanvas();
}