import React from "react";

const TestLayout = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <div className="fixed  top-0  w-full h-[20%] left-0 right-0 px-10  bg-red-500 ">
        <div className="h-full flex justify-between items-center text-center bg-green-400 ">
          <h1 className="h-full flex items-center">left</h1>
          <h1 className="h-full flex items-center">right</h1>
        </div>
      </div>
      <div className="top-[25%] bottom-[25%]   h-[50%] fixed inset-0 overflow-y-auto p-10">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et eveniet
          facilis veniam magnam dolores rerum ab mollitia vero, enim asperiores
          aliquam delectus sapiente aperiam perferendis numquam quia maiores
          nobis quas.
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et eveniet
          facilis veniam magnam dolores rerum ab mollitia vero, enim asperiores
          aliquam delectus sapiente aperiam perferendis numquam quia maiores
          nobis quas.
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et eveniet
          facilis veniam magnam dolores rerum ab mollitia vero, enim asperiores
          aliquam delectus sapiente aperiam perferendis numquam quia maiores
          nobis quas.
        </p>{" "}
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et eveniet
          facilis veniam magnam dolores rerum ab mollitia vero, enim asperiores
          aliquam delectus sapiente aperiam perferendis numquam quia maiores
          nobis quas.
        </p>{" "}
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et eveniet
          facilis veniam magnam dolores rerum ab mollitia vero, enim asperiores
          aliquam delectus sapiente aperiam perferendis numquam quia maiores
          nobis quas.
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et eveniet
          facilis veniam magnam dolores rerum ab mollitia vero, enim asperiores
          aliquam delectus sapiente aperiam perferendis numquam quia maiores
          nobis quas.
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et eveniet
          facilis veniam magnam dolores rerum ab mollitia vero, enim asperiores
          aliquam delectus sapiente aperiam perferendis numquam quia maiores
          nobis quas.
        </p>
      </div>
      <div className="fixed  bottom-0  w-full h-[20%] left-0 right-0 px-10  bg-red-500 ">
        <div className="h-full flex justify-between items-center text-center bg-green-400 ">
          <h1 className="h-full flex items-center">left</h1>
          <h1 className="h-full flex items-center">right</h1>
        </div>
      </div>{" "}
    </div>
  );
};

export default TestLayout;
