import { useEffect, useRef } from 'react';
import moment from 'moment';
import jobService from '../../services/jobService';
import useActiveState from '../../utils/useActiveState';

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

export default function JobPost(props) {
  const jobDetails = useRef(null);
  const viewMoreText = useRef(null);
  const viewMoreIcon = useRef(null);
  const locations =
    props.job.Locations.map((location) => (
      <p key={location.id}>{location.name}</p>
    )) || [];
  const salary = `£${props.job.salary.toLocaleString()} ${
    props.job.SalaryType.name
  }`;

  const categories =
    '<p>' +
      props.job.Category.map((category) => category.name).join(', ') +
      '</p>' || '<p>Loading...</p>';

  const [active, setActive] = useActiveState(jobDetails);
  useEffect(() => {
    if (active) {
      viewMoreText.current.innerText = 'View less';
      viewMoreIcon.current.classList.add('rotate-180');
    } else {
      viewMoreText.current.innerText = 'View more details';
      viewMoreIcon.current.classList.remove('rotate-180');
    }
  }, [active, viewMoreIcon, viewMoreText]);

  return (
    <section className="pt-8 pb-8">
      <article className="block w-full p-8 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-2 text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-10">
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
        <div className="mb-8">
          <div id="job-details-collapse" data-accordion="collapse">
            <h2 id="job-details-collapse-heading">
              <button
                onClick={() => setActive(!active)}
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                data-accordion-target="#job-details-collapse-body"
                aria-expanded="true"
                aria-controls="job-details-collapse-body"
              >
                <span ref={viewMoreText} />
                <svg
                  ref={viewMoreIcon}
                  data-accordion-icon
                  className="w-6 h-6 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </h2>
            <div
              ref={jobDetails}
              id="job-details-collapse-body"
              className="hidden"
              aria-labelledby="job-details-collapse-heading"
            >
              <div className="p-5 font-light border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-900 dark:text-white">
                <p className="font-medium mb-2">Contract Type:</p>
                <p>{props.job.EmploymentContractType.name}</p>
              </div>
              <div className="p-5 font-light border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-900 dark:text-white rounded-b-xl">
                <p className="font-medium mb-2">Job Categories:</p>
                <div
                  className="font-normal text-gray-700 dark:text-gray-400"
                  dangerouslySetInnerHTML={{
                    __html: categories,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="font-normal text-gray-700 dark:text-gray-400"
          dangerouslySetInnerHTML={{
            __html: `<h3 class="font-bold text-2xl mb-3">Full job description - </h3>${props.job.description}`,
          }}
        />
      </article>
    </section>
  );
}
