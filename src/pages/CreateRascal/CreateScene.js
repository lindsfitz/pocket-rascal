import React from "react";
import ReactDOM from "react-dom";
import Matter, { World } from "matter-js";
import AppContext from "../../AppContext";


class CreateScene extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static contextType = AppContext;


    componentDidMount() {

        const myContext = this.context;

        // const myContext = useContext(AppContext);
        const ongoingRascal = {
            color: myContext.userRascal.color,
            nose: myContext.userRascal.nose,
            body: myContext.userRascal.body,
            mouth: myContext.userRascal.mouth,
            eyes: myContext.userRascal.eyes,
            coins: myContext.userRascal.coins
        }

        var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Constraint = Matter.Constraint,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        function setupEngine() {
            var engine = Engine.create({
                gravity: { scale: 0 },
                enableSleeping: true
            });

            Matter.Runner.run(engine);
            return (engine)
        }

        function setupRender() {
            var render = Render.create({
                element: this.refs.scene,
                engine: engine,
                options: {
                    wireframes: false,
                    background: 'transparent'
                },
            });
            Render.run(render);
            Matter.Runner.run(render)
            return render;
        }

        function createMouse() {
            var mouse = Mouse.create(render.canvas); // add mouse control
            var mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 1,
                    render: {
                        visible: false,
                    },
                },
            });
            Composite.add(world, mouseConstraint);
            render.mouse = mouse;
            return mouseConstraint
        }

        function setMouseScaleAndOffset() {
            if (window.innerWidth >= window.innerHeight) {
                Mouse.setScale(mouse, { x: window.innerWidth / window.innerHeight, y: 1 })
                Mouse.setOffset(mouse, { x: 2500 - (2500 * (window.innerWidth / window.innerHeight)), y: 0 })
            } else {
                Mouse.setScale(mouse, { x: 1, y: window.innerHeight / window.innerWidth })
                Mouse.setOffset(mouse, { x: 0, y: 2500 - (2500 * (window.innerHeight / window.innerWidth)) })
            }
        }

        function createRascal() {
            var rascal = Bodies.polygon(2500, 2500, 8, 120, {
                name: "rascal",
                label: 'rascal-body',
                inertia: "Infinity",
                frictionAir: 0.2,
                friction: 0,
                render: {
                    visible: false,
                    isSleeping: true
                },
                // collisionFilter: {
                //     group: bubblecrumbgroup
                // },
            });
            var rascalConstraint = Constraint.create({
                name: "rascal_constraint",
                pointA: { x: 2500, y: 2500 },
                bodyB: rascal,
                pointB: { x: 0, y: 0 },
                stiffness: 0.02,
                render: {
                    visible: false,
                },
            });
            Composite.add(world, [rascal, rascalConstraint]);
            return rascal
        }


        var selectedBody = myContext.userRascal.body + '_' + myContext.userRascal.color || "empty";

        var selectedEyes = myContext.userRascal.eyes || "empty";

        var selectedMouth = myContext.userRascal.mouth || "empty";

        var selectedNose = myContext.userRascal.nose || "empty";

        var animation;
        const canvas = document.querySelector("canvas");
        canvas.setAttribute('id', 'rascalCanvas')
        const ctx = canvas.getContext("2d");
        canvas.width = 5000;
        canvas.height = 5000;
        

        const generate = async () => {


            cancelAnimationFrame(animation);
            const bodyImage = await new Promise((resolve, reject) => {
                const bodyImage = new Image();
                bodyImage.onload = () => resolve(bodyImage);
                bodyImage.onerror = reject;
                bodyImage.src = `./assets/${selectedBody}.png`;
            });
            const eyesImage = await new Promise((resolve, reject) => {
                const eyesImage = new Image();
                eyesImage.onload = () => resolve(eyesImage);
                eyesImage.onerror = reject;
                eyesImage.src = `./assets/${selectedEyes}.png`;
            });

            const mouthImage = await new Promise((resolve, reject) => {
                const mouthImage = new Image();
                mouthImage.onload = () => resolve(mouthImage);
                mouthImage.onerror = reject;
                mouthImage.src = `./assets/${selectedMouth}.png`;

            });
            const noseImage = await new Promise((resolve, reject) => {
                const noseImage = new Image();
                noseImage.onload = () => resolve(noseImage);
                noseImage.onerror = reject;
                noseImage.src = `./assets/${selectedNose}.png`;
            });

            const w = 500;
            const h = 500;
            let frameNumber = 0;


            (function rerender() {
                const bodyOffset = (~~frameNumber * w) % bodyImage.width;
                const eyesOffset = (~~frameNumber * w) % eyesImage.width;
                const mouthOffset = (~~frameNumber * w) % mouthImage.width;
                const noseOffset = (~~frameNumber * w) % noseImage.width;
                const { x, y } = rascal.position;
                ctx.drawImage(
                    bodyImage, // image
                    bodyOffset, // sx
                    0, // sy
                    w, // sWidth
                    h, // sHeight
                    x - w / 2, // dx
                    y - h / 2, // dy
                    w, // dWidth
                    h // dHeight
                );
                ctx.drawImage(
                    eyesImage, // image
                    eyesOffset, // sx
                    0, // sy
                    w, // sWidth
                    h, // sHeight
                    x - w / 2, // dx
                    y - h / 2, // dy
                    w, // dWidth
                    h // dHeight
                );
                ctx.drawImage(
                    mouthImage, // image
                    mouthOffset, // sx
                    0, // sy
                    w, // sWidth
                    h, // sHeight
                    x - w / 2, // dx
                    y - h / 2, // dy
                    w, // dWidth
                    h // dHeight
                );
                ctx.drawImage(
                    noseImage, // image
                    noseOffset, // sx
                    0, // sy
                    w, // sWidth
                    h, // sHeight
                    x - w / 2, // dx
                    y - h / 2, // dy
                    w, // dWidth
                    h // dHeight
                );
                frameNumber += 0.1;
                // Matter.Engine.update(engine);
                animation = requestAnimationFrame(rerender);

            })();
        };

        var engine = setupEngine();
        var render = setupRender();
        var world = engine.world;
        var mouse = createMouse();
        setMouseScaleAndOffset()
        window.addEventListener('resize', setMouseScaleAndOffset)
        var rascal = createRascal();

        const creationPanel = document.querySelector('#creation-panel')


        let tempColor = "white"
        if (creationPanel) {
            creationPanel.addEventListener("click", (e) => {
                var colorCheck = e.target.getAttribute('name')
                var value = e.target.getAttribute('value')
                let regNose = /nose/;
                let regBody = /body/;
                let regEyes = /eyes/;
                let regMouth = /mouth/;
                let resultBody = regBody.exec(value)
                let resultNose = regNose.exec(value)
                let resultEyes = regEyes.exec(value)
                let resultMouth = regMouth.exec(value)
                if (colorCheck === 'color-radio') {
                    tempColor = value
                    let bodyArray = selectedBody.split('_')
                    selectedBody = bodyArray[0] + '_' + bodyArray[1] + '_' + tempColor;
                    cancelAnimationFrame(animation);
                    generate()
                }

                if (resultBody) {
                    selectedBody = value + '_' + tempColor
                    cancelAnimationFrame(animation);
                    generate()
                }
                if (resultEyes) {
                    selectedEyes = value
                    cancelAnimationFrame(animation);
                    generate()
                }
                if (resultNose) {
                    selectedNose = value
                    cancelAnimationFrame(animation);
                    generate()
                }
                if (resultMouth) {
                    selectedMouth = value
                    cancelAnimationFrame(animation);
                    generate()
                }
            })

        }

    }

    render() {
        return (
            <>
                <div ref="scene" id="canvas_container" />
            </>
        )
    }
}
export default CreateScene;