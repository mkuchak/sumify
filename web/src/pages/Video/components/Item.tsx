import clsx from "clsx";

interface ItemProps {
  isCurrent: boolean;
  seekTo: (seconds: number) => void;
  time: string;
  title: string;
  text: string;
}

export function Item({ isCurrent, seekTo, time, title, text }: ItemProps) {
  return (
    <li className="mb-10 ml-4">
      <div
        className={clsx(
          "absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border",
          isCurrent
            ? "bg-gray-200 border-white dark:border-blue-400 dark:bg-blue-400"
            : "bg-gray-200 border-white dark:border-gray-900 dark:bg-gray-700"
        )}
      ></div>
      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        <span
          className={clsx(
            "mb-2 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded border cursor-pointer",
            isCurrent
              ? "bg-blue-100 text-blue-800 dark:bg-gray-700 dark:text-blue-400 border-blue-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400 border-gray-500"
          )}
          onClick={() => seekTo(parseInt(time))}
        >
          <svg
            aria-hidden="true"
            className="w-3 h-3 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            ></path>
          </svg>
          {time}
        </span>
      </time>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{text}</p>
      {/* <a
        href="#"
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
      >
        Jump to{" "}
        <svg className="w-3 h-3 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </a> */}
    </li>
  );
}
