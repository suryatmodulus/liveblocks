import React, { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "@liveblocks/redux";

import {
  addRectangle,
  deleteRectangle,
  selectShape,
  deselectShape,
  moveShape,
  undo,
  redo,
} from "./store";

export default function App() {
  const shapes = useSelector((state) => state.shapes);
  const isLoading = useSelector((state) => state.liveblocks.isStorageLoading);
  const selectedShape = useSelector((state) => state.selectedShape);
  const others = useSelector((state) => state.liveblocks.others);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.enterRoom("redux-whiteboard-demo", {
        shapes: {},
      })
    );

    return () => {
      dispatch(actions.leaveRoom("redux-whiteboard-demo"));
    };
  }, [dispatch]);

  if (isLoading) {
    return <div className="loading">Loading</div>;
  }

  return (
    <>
      <div
        className="canvas"
        onPointerMove={(e) => {
          e.preventDefault();
          dispatch(moveShape({ x: e.clientX, y: e.clientY }));
        }}
        onPointerUp={() => dispatch(deselectShape())}
      >
        {Object.entries(shapes).map(([shapeId, shape]) => {
          let selectionColor = "transparent";

          if (selectedShape === shapeId) {
            selectionColor = "blue";
          } else if (
            others.some((user) => user.presence?.selectedShape === shapeId)
          ) {
            selectionColor = "green";
          }

          return (
            <Rectangle
              key={shapeId}
              id={shapeId}
              shape={shape}
              selectionColor={selectionColor}
            />
          );
        })}
      </div>
      <div className="toolbar">
        <button onClick={() => dispatch(addRectangle())}>Rectangle</button>
        <button
          onClick={() => dispatch(deleteRectangle())}
          disabled={selectedShape == null}
        >
          Delete
        </button>
        <button onClick={() => dispatch(undo())}>Undo</button>
        <button onClick={() => dispatch(redo())}>Redo</button>
      </div>
    </>
  );
}

const Rectangle = ({ shape, selectionColor, id }) => {
  const dispatch = useDispatch();

  return (
    <div
      className="rectangle"
      style={{
        transform: `translate(${shape.x}px, ${shape.y}px)`,
        backgroundColor: shape.fill ? shape.fill : "#CCC",
        borderColor: selectionColor,
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        dispatch(selectShape(id));
      }}
    ></div>
  );
};
