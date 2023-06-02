export function NotFound() {
  return (
    <main className="flex-auto w-full min-w-0 lg:static lg:max-h-full lg:overflow-visible">
      <section className="bg-white dark:bg-gray-900 bg-[url('/bg-pattern.svg')] dark:bg-[url('/bg-pattern-dark.svg')] h-[calc(100vh-14.8rem)] sm:h-[calc(100vh-12.55rem)] md:h-[calc(100vh-14.55rem)] lg:h-[calc(100vh-15.55rem)]">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            Page Not Found:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-400 from-blue-600">404 Error</span>
          </h1>

          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
            The page you are looking for does not exist or the link you pasted is invalid
          </p>
        </div>
        <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
      </section>
    </main>
  );
}
