import React from 'react';
// External
import { useLoaderData } from 'react-router-dom';
import { Card } from '@material-tailwind/react';
// Icons
import { ChartPieIcon } from '@heroicons/react/24/solid';

export function HomePage() {
  const { orders } = (useLoaderData() as {
    orders: [{ total: 0; status: { id: number; name: string } }];
  }) || {
    orders: [{ total: 0, status: { id: 0, name: '' } }],
  };
  const total = orders.reduce(function (accumulator, curValue) {
    return accumulator + curValue.total;
  }, 0);

  console.log(total);
  return (
    <>
      <div className="h-screen m-4 p-4">
        <div className="grid grid-cols-4 gap-4 pb-4">
          {orders.map((order, idx) => (
            <Card
              key={idx}
              className="col-span-2 shadow-md md:col-span-1 max-w-sm relative flex flex-col text-center md:text-right md:flex-row items-center justify-between"
            >
              <div className="w-full h-full">
                <ChartPieIcon className="p-4 rounded-t-xl md:rounded-none md:rounded-l-xl md:max-w-[5rem] md:max-h-[5rem] text-primary-500 bg-gray-300" />
              </div>
              <div className="mr-0 md:mr-4 py-2 space-y-1">
                <p className="text-slate-700 tracking-tight font-monospace text-xs">
                  {order.status.name}
                </p>
                <p className="text-gray-600 text-xs">{order.total}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
