import React from "react";
import Button from "./Button";
import IconButton from "./IconButton";
import { Camera } from "lucide-react";

export default function PropertiesPanel({
  selectedShape,
  onUpdateShape,
  onDeleteShape,
}) {
  return (
    <div className="w-80 h-[calc(100vh-94.4px)] border-l p-3 border-gray-200 flex flex-col gap-5 text-xs text-gray-500">
      {/* Information */}
      <section className="flex flex-col gap-5 w-full">
        <h3 className="text-sm text-gray-700 font-medium">Properties</h3>
        {selectedShape ? (
          <>
            {selectedShape.metadata?.type === "slot" && (
              <>
                <div className="gap-5 items-center flex">
                  <label htmlFor="label" className="text-gray-500 w-[50px]">
                    Label
                  </label>
                  <input
                    type="text"
                    id="label"
                    value={selectedShape.metadata?.label || ""}
                    onChange={(e) =>
                      onUpdateShape({
                        ...selectedShape,
                        metadata: {
                          ...selectedShape.metadata,
                          label: e.target.value,
                        },
                      })
                    }
                    className="bg-gray-100 text-gray-700 rounded-sm p-1 outline-none w-auto"
                  />
                </div>
                <div className="flex gap-5">
                  <p className="w-[50px]">Type</p>
                  <p className="text-gray-700">
                    {selectedShape.metadata?.type}
                  </p>
                </div>
              </>
            )}
            {selectedShape.metadata?.type === "building" && (
              <>
                <div className="flex gap-5">
                  <p className="w-[50px]">Type</p>
                  <p className="text-gray-700">
                    {selectedShape.metadata?.type}
                  </p>
                </div>
                <div className="gap-5 items-center flex">
                  <label htmlFor="name" className="text-gray-500 w-[50px]">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={selectedShape.metadata?.information?.name || ""}
                    onChange={(e) =>
                      onUpdateShape({
                        ...selectedShape,
                        metadata: {
                          ...selectedShape.metadata,
                          information: {
                            ...selectedShape.metadata.information,
                            name: e.target.value,
                          },
                        },
                      })
                    }
                    className="bg-gray-100 text-gray-700 rounded-sm p-1 outline-none w-auto"
                  />
                </div>
                <div className="flex gap-5 w-full">
                  <p className="w-[50px]">Picture</p>
                  <div className="flex relative w-[80px] h-[80px] items-center justify-center bg-gray-100 rounded-md">
                    {selectedShape.metadata?.information?.picture?.url && (
                      <img
                        src={selectedShape.metadata.information.picture.url}
                        alt="Building"
                        className="w-full h-full object-cover rounded-md"
                      />
                    )}
                    <input
                      type="file"
                      id="picture"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          onUpdateShape({
                            ...selectedShape,
                            metadata: {
                              ...selectedShape.metadata,
                              information: {
                                ...selectedShape.metadata.information,
                                picture: {
                                  url: URL.createObjectURL(file),
                                  public_id: null,
                                },
                              },
                            },
                          });
                        }
                      }}
                      className="bg-gray-100 absolute opacity-0 text-gray-700 rounded-sm p-1 outline-none w-full h-full"
                    />
                    {!selectedShape.metadata?.information?.picture?.url && (
                      <Camera strokeWidth={1.5} />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="w-[50px]">Description</p>
                  <textarea
                    type="text"
                    id="description"
                    value={
                      selectedShape.metadata?.information?.description || ""
                    }
                    onChange={(e) =>
                      onUpdateShape({
                        ...selectedShape,
                        metadata: {
                          ...selectedShape.metadata,
                          information: {
                            ...selectedShape.metadata.information,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                    className="bg-gray-100 text-gray-700 rounded-sm p-1 outline-none w-full resize-none h-[100px]"
                  />
                </div>
              </>
            )}
            {selectedShape.geometry.shape === "rect" && (
              <>
                <div className="gap-5 items-center flex">
                  <label htmlFor="height" className="text-gray-500 w-[50px]">
                    Height
                  </label>
                  <input
                    type="number"
                    id="height"
                    value={selectedShape.geometry?.height || ""}
                    onChange={(e) =>
                      onUpdateShape({
                        ...selectedShape,
                        geometry: {
                          ...selectedShape.geometry,
                          height: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="bg-gray-100 text-gray-700 rounded-sm p-1 outline-none w-[100px]"
                  />
                  <p className="-ml-3">px</p>
                </div>
                <div className="gap-5 items-center flex">
                  <label htmlFor="width" className="text-gray-500 w-[50px]">
                    Width
                  </label>
                  <input
                    type="number"
                    id="width"
                    value={selectedShape.geometry?.width || ""}
                    onChange={(e) =>
                      onUpdateShape({
                        ...selectedShape,
                        geometry: {
                          ...selectedShape.geometry,
                          width: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="bg-gray-100 text-gray-700 rounded-sm p-1 outline-none w-[100px]"
                  />
                  <p className="-ml-3">px</p>
                </div>
                <div className="flex items-center gap-5">
                  <label htmlFor="rotate" className="w-[50px]">
                    Rotate
                  </label>
                  <input
                    type="number"
                    id="rotate"
                    value={selectedShape.geometry?.rotation || ""}
                    onChange={(e) =>
                      onUpdateShape({
                        ...selectedShape,
                        geometry: {
                          ...selectedShape.geometry,
                          rotation: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="bg-gray-100 text-gray-700 rounded-sm p-1 outline-none w-[100px]"
                  />
                  <p className="-ml-3">°</p>
                </div>
              </>
            )}
            <div className="flex gap-3 items-center text-gray-700">
              <IconButton
                name={"Trash2"}
                label={"Delete"}
                action={() => onDeleteShape(selectedShape.tempId)}
              />
            </div>
          </>
        ) : (
          <p>No shape selected</p>
        )}
      </section>
    </div>
  );
}
