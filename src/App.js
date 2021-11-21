import React, {useEffect} from 'react';
import {Stage, Layer, Star, Text, Circle, Group, Shape} from 'react-konva';
import {TextField} from "@material-ui/core";
import {Html} from 'react-konva-utils';

const generateShapes = () => {
    return [...Array(2)].map((_, i) => {
        let initialX = Math.trunc(Math.random() * window.innerWidth);
        let initialY = Math.trunc(Math.random() * window.innerHeight)
        const width = initialX > 250 && initialX < 750 ? initialX : 500;
        const height = initialY > 250 && initialY < 750 ? initialY : 500;
        return {
            id: i.toString(),
            x: width,
            y: height,
            rotation: Math.random() * 180,
            isDragging: false,
            imageClickX: width,
            imageClickY: height,
            textXCoordinate: width,
            textYCoordinate: height,
        }
    });
}

const INITIAL_STATE = generateShapes();

const App = () => {
    const [stars, setStars] = React.useState(INITIAL_STATE);


    const handleDragStart = (e) => {
        e.target.moveToTop();
        const id = e.target.id();
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: star.id === id,
                };
            })
        );
    };

    const handleDragEnd = (e) => {
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: false,
                };
            })
        );
    };

    const handleDragMove = (e, starId) => {
        const stage = e.target.getStage();
        const pointerPosition = stage.getPointerPosition();
        const offset = {x: stage.x(), y: stage.y()};
        const clickX = pointerPosition.x - offset.x;
        const clickY = pointerPosition.y - offset.y;

        setStars(
            stars.map((star) => {
                return star.id === starId ?
                    {
                        ...star,
                        imageClickX: clickX,
                        imageClickY: clickY,
                    } : {...star};
            })
        );
    };

    const changeXCoordinate = (e, starId) => {
        setStars((prevState) =>
            prevState.map((star) => {
                return star.id === starId ?
                    {
                        ...star,
                        x: star.x + 1,
                        imageClickX: star.imageClickX + 1,
                        textXCoordinate: star.textXCoordinate + 1,
                    } : {...star};
            })
        )
    }

    const changeYCoordinate = (e, starId) => {
        setStars((prevState) =>
            prevState.map((star) => {
                return star.id === starId ?
                    {
                        ...star,
                        y: star.y + 1,
                        imageClickY: star.imageClickY + 1,
                        textYCoordinate: star.textYCoordinate + 1,
                    } : {...star};
            })
        )
    }

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                {stars.map((star) => (
                    <Group draggable onDragMove={(e) => handleDragMove(e, star.id)}
                           onDragStart={(e) => e.target.moveToTop()}>
                        <Circle
                            key={star.id}
                            id={star.id}
                            x={star.x}
                            y={star.y}
                            radius={100}
                            fill="#ff705a"
                            opacity={1}
                            rotation={star.rotation}
                            shadowColor="black"
                            shadowBlur={10}
                            shadowOpacity={0.6}
                            shadowOffsetX={star.isDragging ? 10 : 5}
                            shadowOffsetY={star.isDragging ? 10 : 5}
                            scaleX={star.isDragging ? 1.2 : 1}
                            scaleY={star.isDragging ? 1.2 : 1}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}

                        />
                        <Html>
                            <TextField
                                style={{
                                    width: '51px',
                                    height: '25px',
                                    left: String(star.textXCoordinate - 20) + "px",
                                    top: String(star.textYCoordinate - 60) + "px"
                                }}
                                draggable
                                id="coordinates"
                                label="X"
                                type="number"
                                value={Number(star.imageClickX)}
                                placeholder="X"
                                margin="normal"
                                onClick={(e) => changeXCoordinate(e, star.id)}
                            />
                            <br/>
                            <TextField
                                style={{
                                    width: '51px',
                                    height: '25px',
                                    left: String(star.textXCoordinate - 20) + "px",
                                    top: String(star.textYCoordinate - 60) + "px"
                                }}
                                shrinker
                                id="coordinates"
                                label="Y"
                                type="number"
                                value={star.imageClickY}
                                placeholder="X"
                                margin="normal"
                                onClick={(e) => changeYCoordinate(e, star.id)}
                            />
                        </Html>
                    </Group>
                ))}
                <Shape
                    sceneFunc={(context, shape) => {
                        context.beginPath();
                        context.moveTo(stars[0].imageClickX - 32.5, stars[0].imageClickY - 10);
                        context.lineTo(stars[1].imageClickX - 32.5, stars[1].imageClickY - 10);
                        context.closePath();
                        context.fillStrokeShape(shape);
                    }}
                    fill="#00D2FF"
                    stroke="black"
                    strokeWidth={4}
                />
            </Layer>
        </Stage>
    );
};

export default App;
