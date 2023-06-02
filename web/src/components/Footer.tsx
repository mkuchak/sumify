export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.05),_10px_10px_30px_4px_rgba(0,0,0,0.1)] dark:bg-gray-900 bottom-0 relative z-40 flex-none w-full mx-auto mt-auto">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 flex flex-col min-h-[calc(100vh-83rem)]">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="#" className="flex items-center mb-4 sm:mb-0">
            <img src="/sumify.svg" className="h-8 mr-1.5" alt="Sumify Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Sumify</span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {currentYear} Sumify. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
