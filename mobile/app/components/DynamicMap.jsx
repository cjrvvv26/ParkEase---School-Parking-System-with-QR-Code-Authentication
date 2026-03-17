import Svg, { Rect, Polygon, Line, G, Circle } from 'react-native-svg';
import { View } from 'react-native';

export default function MapRenderer({ data }) {
  const { map, shapes, slotId } = data;
  const gridSize = 50; // distance between grid lines

  const verticalLines = [];
  const horizontalLines = [];

  for (let x = 0; x <= map.width; x += gridSize) {
    verticalLines.push(
      <Line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={map.height}
        stroke='#ddd'
        strokeWidth='1'
      />,
    );
  }

  for (let y = 0; y <= map.height; y += gridSize) {
    horizontalLines.push(
      <Line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={map.width}
        y2={y}
        stroke='#ddd'
        strokeWidth='1'
      />,
    );
  }
  return (
    <View style={{ height: 240 }}>
      <Svg
        width='100%'
        height='100%'
        preserveAspectRatio='xMidYMid meet'
        viewBox={`0 0 ${map.width} ${map.height}`}
      >
        {verticalLines}
        {horizontalLines}
        {shapes.map((shape) => {
          const g = shape.geometry;

          // RECTANGLE
          if (g.shape === 'rect') {
            return (
              <G key={shape._id}>
                <Rect
                  x={g.x}
                  y={g.y}
                  width={g.width}
                  height={g.height}
                  fill='#9ca3af'
                  transform={`rotate(${g.rotation}, ${g.x + g.width / 2}, ${g.y + g.height / 2})`}
                />
                {shape._id === slotId && (
                  <>
                    <Circle
                      r={20}
                      fill='#ede9fe'
                      cx={g.x + g.width / 2}
                      cy={g.y + g.height / 2}
                    />
                    <Circle
                      r={15}
                      fill='#8e51ff'
                      cx={g.x + g.width / 2}
                      cy={g.y + g.height / 2}
                    />
                  </>
                )}
              </G>
            );
          }

          // POLYGON
          if (g.shape === 'polygon') {
            const points = g.points.map((p) => `${p.x},${p.y}`).join(' ');

            return (
              <Polygon
                key={shape._id}
                points={points}
                fill='#9ca3af'
                stroke='black'
                strokeWidth='1'
              />
            );
          }

          return null;
        })}
      </Svg>
    </View>
  );
}
