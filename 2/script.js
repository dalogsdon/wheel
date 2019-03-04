import Utils from "/standup/Utils.js";

// WORK IN PROGRESS

const d = document;
const { names, say } = Utils;

const getNameFromElement = e => {
    return e.getAttribute('data-name');
}
function now() {
    return +new Date();
}

// create name tags
const container = d.querySelector('.wheel');
const deg = 360 / names.length;
names.forEach((name, i) => {
    const tag = d.createElement('span');
    tag.classList.add('tag');
    tag.style.transform = `rotate(${deg*(i)}deg)`;
    tag.setAttribute('data-name', name.spoken || name.value);

    const text = d.createElement('span');
    text.classList.add('name');
    text.innerHTML = name.value;
    tag.append(text);
    text.style.transform = 'rotate(90deg)';

    container.append(tag);
});

const wheel = d.querySelector('.wheel');
let wheelRotateRad = 0;
let wheelEvent = null;
wheel.addEventListener('mousedown', (evt) => {
    wheelEvent = {
        x: evt.clientX,
        y: evt.clientY,
        cx: d.body.clientWidth/2,
        cy: d.body.clientHeight/2,
        rotate: wheelRotateRad,
        speed: 0,
        ts: now(),
        down: true
    };
    window.clearInterval(spinInterval);
    console.log('press');
});
d.addEventListener('mousemove', (evt) => {
    if (wheelEvent && wheelEvent.down) {
        // rotate the wheel to move with mouse
        const angle = wheelRotateRad + computeAngle(wheelEvent.x, wheelEvent.y, evt.clientX, evt.clientY, wheelEvent.cx, wheelEvent.cy);
        wheel.style.transform = `rotate(${angle}rad)`;

        // compute spin speed in radians
        const ts = now();
        wheelEvent.speed = angle / (ts - wheelEvent.ts);
        wheelEvent.ts = ts;

        // TODO move speed computation into function to reuse in mouseup
        // TODO keep track of prevous few points to better compute speed
    }
});
d.addEventListener('mouseup', (evt) => {
    if (wheelEvent) {
        wheelRotateRad = clampRad(wheelRotateRad + computeAngle(wheelEvent.x, wheelEvent.y, evt.clientX, evt.clientY, wheelEvent.cx, wheelEvent.cy));
        wheelEvent.down = false;

        // TODO compute speed here too

        spinWheel();
        console.log('release');
    }
});

const Pi2 = Math.PI*2;
function clampRad(rad) {
    return rad < Pi2 ? rad : rad % Pi2;
}

function computeAngle(x1, y1, x2, y2, cx, cy) {
    return Math.atan2(x1-cx, y1-cy) - Math.atan2(x2-cx, y2-cy);
}

let spinInterval = null;
const friction = 0.001;
function spinWheel() {
    if (wheelEvent) {
        console.log('spinning with speed ' + wheelEvent.speed);
        spinInterval = window.setInterval(() => {
            // TODO account for rotation direction independent of speed
            wheelEvent.speed = Math.max(0, wheelEvent.speed - friction);
            if (wheelEvent.speed === 0) {
                window.clearInterval(spinInterval);
            }
            wheelRotateRad += wheelEvent.speed;
            wheelRotateRad = clampRad(wheelRotateRad);
            wheel.style.transform = `rotate(${wheelRotateRad}rad)`;
        }, 33);
    }
}
