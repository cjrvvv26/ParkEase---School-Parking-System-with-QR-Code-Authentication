import React from "react";
export default function AdminBldg() {
  const frontAdminBldg = [
    { id: "slot20", x: 212.5, y: 209.5 },
    { id: "slot19", x: 212.5, y: 251.5 },
    { id: "slot18", x: 212.5, y: 293.5 },
    { id: "slot17", x: 212.5, y: 335.5 },
  ];
  const SideAcadBldg = [
    {
      id: "slot16",
      x: 419,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 901.5 -36.5)",
    },
    {
      id: "slot15",
      x: 377,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 859.5 5.5)",
    },
    {
      id: "slot14",
      x: 335,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 817.5 47.5)",
    },
    {
      id: "slot13",
      x: 293,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 775.5 89.5)",
    },
    {
      id: "slot12",
      x: 587,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 1069.5 -204.5)",
    },
    {
      id: "slot11",
      x: 545,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 1027.5 -162.5)",
    },
    {
      id: "slot10",
      x: 503,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 985.5 -120.5)",
    },
    {
      id: "slot09",
      x: 461,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 943.5 -78.5)",
    },
    {
      id: "slot08",
      x: 755,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 1237.5 -372.5)",
    },
    {
      id: "slot07",
      x: 713,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 1195.5 -330.5)",
    },
    {
      id: "slot06",
      x: 671,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 1153.5 -288.5)",
    },
    {
      id: "slot05",
      x: 629,
      y: 414,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 1111.5 -246.5)",
    },
  ];
  const SideRoad = [
    {
      id: "slot04",
      x: 584,
      y: 241,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 893.5 -374.5)",
    },
    {
      id: "slot03",
      x: 542,
      y: 241,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 851.5 -332.5)",
    },
    {
      id: "slot02",
      x: 500,
      y: 241,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 809.5 -290.5)",
    },
    {
      id: "slot01",
      x: 458,
      y: 241,
      transform: "matrix(-1.836970e-16 1 -1 -1.836970e-16 767.5 -248.5)",
    },
  ];

  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      //orig viewbox 1365
      viewBox="0 0 1200 485"
      enable-background="new 0 0 1366 485"
      xml:space="preserve"
    >
      <polygon
        id="AdminBldg"
        fill="#F3F4F6"
        stroke="#F3F4F6"
        stroke-width="3"
        stroke-miterlimit="10"
        points="14.42,8.5 264.45,8.5 
	264.45,52.33 313,52.33 313,123.97 208.82,123.97 208.82,186.93 313,186.93 313,204.18 206.79,204.18 206.56,344 2.47,344 2.47,8.5 
	"
      />
      <rect
        x="324.5"
        y="8.5"
        fill="#F3F4F6"
        stroke="#F3F4F6"
        stroke-width="3"
        stroke-miterlimit="10"
        width="205"
        height="114.16"
      />
      <g id="FrontAdmin">
        {frontAdminBldg.map((slot, index) => (
          <g key={index} id={slot.id}>
            <rect
              x={slot.x}
              y={slot.y}
              fill="#E5E7EB"
              stroke="#E5E7EB"
              stroke-width="3"
              stroke-miterlimit="10"
              width="100"
              height="37"
            />
            {/* Pin Indicator */}
            <g className="cursor-pointer">
              <circle
                cx={slot.x + 100 / 2} // center X of the slot
                cy={slot.y + 37 / 2} // center Y of the slot
                r="7"
                fill="#00c951"
              />
              <circle
                cx={slot.x + 100 / 2}
                cy={slot.y + 37 / 2}
                r="13"
                fill="#7bf1a8"
                opacity={0.3}
              />
              <circle
                cx={slot.x + 100 / 2}
                cy={slot.y + 37 / 2}
                r="18"
                fill="#dcfce7"
                opacity={0.5}
              />
            </g>
          </g>
        ))}
      </g>
      <g id="SideAcadBldg">
        {SideAcadBldg.map((slot, index) => (
          <g key={index} id={slot.id}>
            <rect
              x={slot.x}
              y={slot.y}
              transform={slot.transform}
              fill="#E5E7EB"
              stroke="#E5E7EB"
              stroke-width="3"
              stroke-miterlimit="10"
              width="100"
              height="37"
            />
            {/* Pin Indicator */}
            <g className="cursor-pointer">
              <circle
                cx={slot.x + 100 / 2} // center X of the slot
                cy={slot.y + 37 / 2} // center Y of the slot
                r="7"
                fill="#ff2056"
              />
              <circle
                cx={slot.x + 100 / 2}
                cy={slot.y + 37 / 2}
                r="13"
                fill="#ffa1ad"
                opacity={0.3}
              />
              <circle
                cx={slot.x + 100 / 2}
                cy={slot.y + 37 / 2}
                r="18"
                fill="#ffe4e6"
                opacity={0.5}
              />
            </g>
          </g>
        ))}
      </g>
      <g id="SideRoad">
        {SideRoad.map((slot, index) => (
          <g key={index} id={slot.id} transform={slot.transform}>
            <rect
              x={slot.x}
              y={slot.y}
              fill="#E5E7EB"
              stroke="#E5E7EB"
              stroke-width="3"
              stroke-miterlimit="10"
              width="100"
              height="37"
            />
            {/* Pin Indicator */}
            <g className="cursor-pointer">
              <circle
                cx={slot.x + 100 / 2}
                cy={slot.y + 37 / 2}
                r="7"
                fill="#ff2056"
              />
              <circle
                cx={slot.x + 100 / 2}
                cy={slot.y + 37 / 2}
                r="13"
                fill="#ffa1ad"
                opacity={0.3}
              />
              <circle
                cx={slot.x + 100 / 2}
                cy={slot.y + 37 / 2}
                r="18"
                fill="#ffe4e6"
                opacity={0.5}
              />
            </g>
          </g>
        ))}
      </g>
      <polygon
        fill="#F3F4F6"
        stroke="#F3F4F6"
        stroke-width="3"
        stroke-miterlimit="10"
        points="541.45,8.5 541.45,196.19 663.23,196.19 
	663.5,166.5 732.5,166.5 732.5,259.5 1361.02,259.5 1361.02,8.5 "
      />
      <rect
        x="1037.5"
        y="270"
        fill="#F3F4F6"
        stroke="#F3F4F6"
        stroke-width="3"
        stroke-miterlimit="10"
        width="323.52"
        height="212.5"
      />
    </svg>
  );
}
