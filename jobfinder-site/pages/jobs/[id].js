import moment from 'moment';
import jobService from '../../services/jobService';

export async function getServerSideProps(context) {
  const job = await jobService.getPost(context.query.id);
  if (!job || job.status === 404) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      job,
    }, // will be passed to the page component as props
  };
}

export default function Job(props) {
  const locations =
    props.job.Locations.map((location) => (
      <p key={location.id}>{location.name}</p>
    )) || [];
  const salary = `£${props.job.salary.toLocaleString()} ${
    props.job.SalaryType.name
  }`;

  return (
    <section className="pt-8 pb-8">
      <article className="block w-full p-8 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h1 class="mb-2 text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-10">
          {props.job.title}
        </h1>
        <div className="border-l-4 pl-4 text-gray-900 dark:text-white mb-8">
          <div className="mb-4">
            <p className="font-bold mb-3">Locations:</p>
            <div>{locations}</div>
          </div>
          <div className="mb-4">
            <p className="font-bold mb-3">Salary:</p>
            <div>{salary}</div>
          </div>
          <div className="mb-0">
            <p className="font-bold mb-3">Closing date:</p>
            <p>{moment(props.job.deadline).format('LL')}</p>
          </div>
        </div>
        <div class="font-normal text-gray-700 dark:text-gray-400">
          <span class="font-bold text-xl">Full description - </span>
          {props.job.description}
        </div>
      </article>
    </section>
  );
}
