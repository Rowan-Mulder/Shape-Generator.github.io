//*/ Variables and initialization
let svg = document.getElementById("svg");
let polygon = document.getElementById("polygon");

let pointAmount = document.getElementById("pointAmount");
let rotation = document.getElementById("rotation");
let minDistance = document.getElementById("minDistance");
let maxDistance = document.getElementById("maxDistance");
let autoGenerate = document.getElementById("autoGenerate");
let generateOnUpdate = document.getElementById("generateOnUpdate");
let generateOnInterval = document.getElementById("generateOnInterval");
let generateInterval = document.getElementById("generateInterval");

let innerRing = document.getElementById("innerRing");
let outerRing = document.getElementById("outerRing");


let ringClamping = true;
let generatorInputs = [pointAmount, rotation, minDistance, maxDistance, autoGenerate, generateOnUpdate, generateOnInterval, generateInterval];


let timer = setInterval(() => {
    ShapeGenerator();
}, generateInterval.value);

Math.clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

ResetInputs()
ShapeGenerator();
//*/

//*/ Event handlers
pointAmount.oninput = () => {
    UpdateGenerationInputsLogic();
    UpdateGenerationInputsDisplay();
};
rotation.oninput = () => {
    UpdateGenerationInputsLogic();
    UpdateGenerationInputsDisplay();
}
minDistance.oninput = () => {
    innerRing.r.baseVal.value = minDistance.value;

    UpdateOuterRing();
    UpdateGenerationInputsLogic();
    UpdateGenerationInputsDisplay();
};
maxDistance.oninput = () => {
    outerRing.r.baseVal.value = maxDistance.value;

    UpdateInnerRing();
    UpdateGenerationInputsLogic();
    UpdateGenerationInputsDisplay();
};
autoGenerate.oninput = () => {
    UpdateGenerationInputsLogic(true);
    UpdateGenerationInputsDisplay();
};
generateOnUpdate.oninput = () =>  {
    UpdateGenerationInputsLogic(true);
    UpdateGenerationInputsDisplay();
};
generateOnInterval.oninput = () => {
    UpdateGenerationInputsLogic(true);
    UpdateGenerationInputsDisplay();
};
generateInterval.oninput = () => {
    UpdateGenerationInputsLogic(true);
    UpdateGenerationInputsDisplay();
};
generateShapeButton.onclick = () => ShapeGenerator();
randomizeButton.onclick = () => {
    let rings = [];

    for (generatorInput in generatorInputs) {
        switch (Number(generatorInput)) {
            case 0:
                generatorInputs[generatorInput].value = Math.round((Math.random() * (generatorInputs[generatorInput].max - generatorInputs[generatorInput].min)) + generatorInputs[generatorInput].min);
                break;
            case 2:
            case 3:
                rings.push(Math.round((Math.random() * (generatorInputs[generatorInput].max - generatorInputs[generatorInput].min)) + generatorInputs[generatorInput].min));
                break;
        }
    }

    generatorInputs[2].value = Math.min(rings[0], rings[1]);
    generatorInputs[3].value = Math.max(rings[0], rings[1]);

    if (autoGenerate.checked && generateOnUpdate.checked) {
        ShapeGenerator();
    }

    UpdateGenerationInputsLogic(true);
    UpdateGenerationInputsDisplay();
    UpdateInnerRing();
    UpdateOuterRing();
};
resetButton.onclick = () => {
    ResetInputs();
};
//*/

//*/ Functions
function ShapeGenerator() {
    polygon.points.clear();
    let pointAmountNumber = Number(document.getElementById("pointAmount").value);
    let minDistanceNumber = Number(document.getElementById("minDistance").value);
    let maxDistanceNumber = Number(document.getElementById("maxDistance").value);
    
    for (let i = 0; i < pointAmountNumber; i++) {
        let point = svg.createSVGPoint();
        let degrees = (360 / pointAmountNumber) * (i + 1);
        let distance = (Math.random() * (maxDistanceNumber - minDistanceNumber)) + minDistanceNumber;
        let radians = degrees * 2 * Math.PI / 360;
        point.x = (Math.cos(radians) * distance) + 160;
        point.y = (Math.sin(radians) * distance) + 160;
        polygon.points.appendItem(point);
    }

    svg.style.transform = `rotate(${Number(rotation.value)}deg)`;
}

function UpdateGenerationInputsLogic(intervalChanged = false) {
    if (intervalChanged) {
        clearInterval(timer);
    }

    if (autoGenerate.checked) {
        if (intervalChanged && generateOnInterval.checked) {
            timer = setInterval(() => {
                ShapeGenerator();
            }, generateInterval.value);
        } else if (generateOnUpdate.checked) {
            ShapeGenerator();
        }
    }
}

function UpdateGenerationInputsDisplay() {
    if (autoGenerate.checked) {
        autoGenerateMethodsContainer.style.display = "block";
        if (generateOnInterval.checked) {
            generateIntervalContainer.style.display = "block";
        } else {
            generateIntervalContainer.style.display = "none";
        }
        generateShapeButton.style.display = "none";
    } else {
        autoGenerateMethodsContainer.style.display = "none";
        generateIntervalContainer.style.display = "none";
        generateShapeButton.style.display = "inline-block";
    }

    pointAmountDisplay.innerHTML = pointAmount.value;
    rotationDisplay.innerHTML = rotation.value;
    minDistanceDisplay.innerHTML = minDistance.value;
    maxDistanceDisplay.innerHTML = maxDistance.value;
    generateIntervalDisplay.innerHTML = generateInterval.value
}

function UpdateInnerRing() {
    if (ringClamping) {
        let clampedRingSize = Math.clamp(minDistance.value, minDistance.min, maxDistance.value);
        minDistance.value = clampedRingSize;
        innerRing.r.baseVal.value = clampedRingSize;
    } else {
        innerRing.r.baseVal.value = minDistance.value;
    }
}

function UpdateOuterRing() {
    if (ringClamping) {
        let clampedRingSize = Math.clamp(maxDistance.value, minDistance.value, maxDistance.max);
        maxDistance.value = clampedRingSize;
        outerRing.r.baseVal.value = clampedRingSize;
    } else {
        outerRing.r.baseVal.value = maxDistance.value;
    }
}

function ResetInputs() {
    for (generatorInput in generatorInputs) {
        switch(Number(generatorInput)) {
            case 0:
                generatorInputs[generatorInput].value = 10;// Point amount
                break;
            case 1:
                generatorInputs[generatorInput].value = 0;// Rotation
                break;
            case 2:
                generatorInputs[generatorInput].value = 50;// Minimum distance
                break;
            case 3:
                generatorInputs[generatorInput].value = 150;// Maximum distance
                break;
            case 4:
                generatorInputs[generatorInput].checked = true;// Auto generation
                break;
            case 5:
                generatorInputs[generatorInput].checked = false;// Generate on update
                break;
            case 6:
                generatorInputs[generatorInput].checked = true;// Generate on interval
                break;
            case 7:
                generatorInputs[generatorInput].value = 1000;// Generation interval
                break;
        }
    }

    UpdateGenerationInputsLogic(true);
    UpdateGenerationInputsDisplay();
    UpdateInnerRing();
    UpdateOuterRing();
}
//*/