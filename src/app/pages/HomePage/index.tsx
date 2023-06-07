import * as React from 'react';
// External
import { Card, CardBody, Typography } from '@material-tailwind/react';

export function HomePage() {
  return (
    <>
      <div className="bg-white h-screen m-4 p-4 ">
        <table className="w-full min-w-max table-auto text-right overflow-x-scroll">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-2">
                <Typography
                  color="blue-gray"
                  className="font-normal leading-none opacity-70 text-left text-[12px]"
                >
                  Part #
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-2">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70 text-left text-[12px]"
                >
                  Part Name
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-blue-gray-50/50">
              <td className="p-2">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  3105
                </Typography>
              </td>
              <td className="p-2">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  Spark Plugs
                </Typography>
              </td>
            </tr>
            <tr className="even:bg-blue-gray-50/50">
              <td className="p-2">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  3105
                </Typography>
              </td>
              <td className="p-2">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  Spark Plugs
                </Typography>
              </td>
            </tr>
          </tbody>
        </table>

        <Card className="mt-6 w-96">
          <CardBody>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70 text-left text-xs"
            >
              Hello There
            </Typography>
            <button className="px-4 py-2 rounded-xl shadow-lg text-segunda-100 bg-primera-100">
              Material Button
            </button>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
