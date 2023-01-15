import React from 'react';

export default function Pagination(props) {
  const pages = Math.ceil(props.totalRecords / 10);

  function isFirstButton(index) {
    return pages / (index + 1) === pages;
  }

  function isLastButton(index) {
    return pages === index + 1;
  }

  const buttons = () => {
    return new Array(pages).fill(null).map((_, index) => {
      return (
        <li key={index}>
          <button
            onClick={() => props.setPage(index + 1)}
            className={`p-5 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 ${
              isFirstButton(index) ? 'rounded-l-lg' : ''
            } ${
              isLastButton(index) ? 'rounded-r-lg' : ''
            } hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            {index + 1}
          </button>
        </li>
      );
    });
  };

  return (
    <div className="pt-8 pb-8">
      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px">
          <li>
            <button
              onClick={() => props.setPage(1)}
              className={`p-5 mr-5 leading-tight text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              Go to first
            </button>
          </li>
          {buttons()}
          <li>
            <button
              onClick={() => props.setPage(pages)}
              className={`p-5 ml-5 leading-tight text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              Go to last
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
