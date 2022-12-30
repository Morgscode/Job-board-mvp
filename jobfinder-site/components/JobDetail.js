export default function JobDetail(props) {
  const description =
    props.job?.description?.split('')?.slice(0, 155).join('') + '...' ||
    'Loading...';

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <p className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
        {props.job.title}
      </p>
      <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {description}
      </div>
    </div>
  );
}
