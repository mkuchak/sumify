import { PropsWithChildren } from "react";

interface TimelineProps {
  isLoading: boolean;
}

export function Timeline({ isLoading, children }: PropsWithChildren<TimelineProps>) {
  return (
    <div className="pt-4 pb-8 px-4 mx-auto max-w-screen-xl lg:p-16 lg:py-16 grid lg:grid-cols-1 gap-8 lg:gap-16">
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <li className="mb-10 ml-4 max-w-2xl animate-pulse" key={index}>
                <div className="bg-gray-200 border-white dark:border-gray-900 dark:bg-gray-700 absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border"></div>
                <time className="-ml-2.5 mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  <span className="mb-2 inline-flex items-center px-2.5 py-0.5">
                    <div className="h-[0.75rem] bg-gray-200 rounded-full dark:bg-gray-700 w-14 mb-4"></div>
                  </span>
                </time>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[320px] mb-2.5"></div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[270px] sm:max-w-[630px] mb-2.5"></div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[230px] sm:max-w-[590px] mb-2.5"></div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] sm:max-w-[660px] mb-2.5"></div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[250px] sm:max-w-[610px]"></div>
              </li>
            ))}
          </>
        ) : (
          children
        )}
      </ol>
    </div>
  );
}
