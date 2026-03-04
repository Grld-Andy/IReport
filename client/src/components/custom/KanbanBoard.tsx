import React from "react";
import { FaRegCommentDots } from "react-icons/fa6";

const KanbanBoard: React.FC = () => {
  const status = ["Open", "In Progress", "Closed", "Critical"];

  return (
    <div className="p-3 rounded-lg">
      <div className="flex gap-2 overflow-x-scroll hide-scrollbar">
        {status.map((item, index) => (
          <div
            key={index}
            className="p-3 bg-gray-100 rounded-xl w-[300px] flex-shrink-0"
          >
            <div className="flex justify-between items-center pb-5">
              <h1 className="text-[1.1em]">{item}</h1>
              <p>5</p>
            </div>

            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white px-2 py-1 rounded-lg shadow-md border border-black/10"
                >
                  <h1 className="font-semibold">Prepare some random stuff</h1>
                  <p className="text-sm">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Laboriosam, veritatis.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center gap-2">
                      <FaRegCommentDots />
                      <span>2</span>
                    </div>
                    <div className="w-[25px] grid place-content-center text-white h-[25px] bg-orange-700 rounded-full overflow-hidden">
                      A
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* <div className="bg-red-50 p-5 w-full">
        <ReactSortable
          className="border bg-red-50 w-full flex gap-2"
          tag={CustomComponent}
          list={randomListB}
          setList={setRandomListB}
          group={"shared"}
        >
          {randomListB.map((item) => (
            <div className="border" key={item.id}>
              {item.name}
            </div>
          ))}
        </ReactSortable>
      </div>

      <div className="bg-blue-50 p-5 w-full">
        <ReactSortable
          tag={CustomComponent}
          list={randomListA}
          setList={setRandomListA}
          group={"shared"}
        >
          {randomListA.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </ReactSortable>
      </div> */}
      </div>
    </div>
  );
};

export default KanbanBoard;
