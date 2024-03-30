const objects = [];


export class GameObject {
    constructor() {
        objects.push(this);
        this.is_started = false;
        this.timedelta = 0;
    }

    start() {

    }

    update() {

    }

    destroy() {
        for (let i in objects) {
            if (objects[i] === this) {
                objects.splice(i, 1);
                break;
            }
        }
    }
}


let lastTimeStamp = 0;
const step = timeStamp => {
    for (let object of objects) {
        if (object.is_started === false) {
            object.start();
            object.is_started = true;
        } else {
            object.timedelta = timeStamp - lastTimeStamp;
            object.update();
        }
    }
    lastTimeStamp = timeStamp;
    requestAnimationFrame(step);
};

requestAnimationFrame(step);