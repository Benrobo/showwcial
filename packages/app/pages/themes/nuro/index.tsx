export default function NuroTheme() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-dark-900 to-black from-20% to-80% font-inter text-gray-500 selection:bg-gray-900 selection:dark:bg-white selection:text-white selection:dark:text-primary-50 overflow-auto">
      <main className="w-full max-w-[] h-full px-8 py-12 flex flex-col items-center justify-center">
        <IntroSection />
      </main>
    </div>
  );
}

function IntroSection() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      <h1 className="text-white-100 dark:text-white text-5xl sm:text-6xl md:text-6xl lg:text-8xl tracking-tight font-extrabold">
        Hey{" "}
        <span className="inline-block origin-70 hover:animate-wave">👋</span>{" "}
        I'm Ben, <br className="hidden sm:block" />a
        <div className="inline-flex px-3 lg:px-5 py-2 md:pb-4 bg-blue-705 bg-opacity-15 backdrop-filter backdrop-blur-sm filter saturate-200 text-primary-200 rounded-2xl default-transition default-focus mt-4 text-blue-200 ml-4">
          developer
        </div>
      </h1>
      <p className="max-w-xs mt-4 md:mt-8 mx-auto font-pp-rg text-base text-gray-400 sm:text-md md:text-xl md:max-w-3xl">
        I solve problem for a living.
      </p>
    </div>
  );
}
