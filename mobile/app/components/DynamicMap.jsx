import Svg, { Rect, Polygon, Line, G, Circle, Text } from 'react-native-svg';
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
                      fill='#dbeafe'
                      cx={g.x + g.width / 2}
                      cy={g.y + g.height / 2}
                    />
                    <Circle
                      r={15}
                      fill='#3b82f6'
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
            const xs = g.points.map((p) => p.x);
            const ys = g.points.map((p) => p.y);
            const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
            const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
            const label =
              shape.metadata?.information?.name || shape.metadata?.label || '';

            return (
              <G key={shape._id}>
                <Polygon
                  points={points}
                  fill='#9ca3af'
                  stroke='black'
                  strokeWidth='1'
                />
                {label ? (
                  <Text
                    x={cx}
                    y={cy}
                    fill='#111'
                    fontSize='12'
                    fontWeight='700'
                    textAnchor='middle'
                    alignmentBaseline='middle'
                  >
                    {label}
                  </Text>
                ) : null}
              </G>
            );
          }

          // ARROW
          if (g.shape === 'arrow') {
            const points = g.points || [];
            if (points.length < 2) return null;
            const start = points[0];
            const end = points[points.length - 1];
            const headlen = 12;
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const arrowPoints = [
              {
                x: end.x - headlen * Math.cos(angle - Math.PI / 6),
                y: end.y - headlen * Math.sin(angle - Math.PI / 6),
              },
              end,
              {
                x: end.x - headlen * Math.cos(angle + Math.PI / 6),
                y: end.y - headlen * Math.sin(angle + Math.PI / 6),
              },
            ];

            return (
              <G key={shape._id}>
                <Line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke='black'
                  strokeWidth='2'
                />
                <Polygon
                  points={arrowPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill='black'
                />
              </G>
            );
          }

          // TEXT LABEL
          if (g.shape === 'text') {
            const label =
              shape.metadata?.textContent ??
              shape.metadata?.text ??
              shape.metadata?.label ??
              '';
            const fontSize = shape.metadata?.fontSize || 16;
            const fontColor = shape.metadata?.fontColor || '#000000';

            return (
              <G key={shape._id}>
                <Rect
                  x={g.x}
                  y={g.y}
                  width={g.width}
                  height={g.height}
                  fill='transparent'
                />
                {label ? (
                  <Text
                    x={g.x + (g.width || 0) / 2}
                    y={g.y + (g.height || 0) / 2}
                    fill={fontColor}
                    fontSize={fontSize}
                    fontWeight='700'
                    textAnchor='middle'
                    alignmentBaseline='middle'
                  >
                    {label}
                  </Text>
                ) : null}
              </G>
            );
          }

          return null;
        })}
      </Svg>
    </View>
  );
}
