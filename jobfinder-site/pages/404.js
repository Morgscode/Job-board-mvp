export default function Custom404() {
    return (
      <div class="flex h-[calc(100vh-80px)] items-center justify-center p-5 w-full bg-white dark:bg-gray-900">
        <div class="text-center">
          <div class="inline-flex rounded-full bg-red-100 p-4">
            <div class="rounded-full stroke-red-600 bg-red-200 p-4">
              <svg
                class="w-16 h-16"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 8H6.01M6 16H6.01M6 12H18C20.2091 12 22 10.2091 22 8C22 5.79086 20.2091 4 18 4H6C3.79086 4 2 5.79086 2 8C2 10.2091 3.79086 12 6 12ZM6 12C3.79086 12 2 13.7909 2 16C2 18.2091 3.79086 20 6 20H14"
                  strokeWidth="2"
                  strokeLineCap="round"
                  strokeLineJoin="round"
                ></path>
                <path
                  d="M17 16L22 21M22 16L17 21"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </div>
          <h1 class="mt-5 text-[36px] font-bold text-slate-800 lg:text-[50px] dark:text-white">
            404 - That page does not seem to exist
          </h1>
        </div>
      </div>
    );
  }
  