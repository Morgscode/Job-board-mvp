import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../../utils/session';
import moment from 'moment';
import jobService from '../../../services/jobService';
import useActiveState from '../../../utils/useActiveState';
import useAuthState from '../../../utils/useAuthState';

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res, query }) => {
    const { user = null } = req.session;
    const job = await jobService.getPost(query.id);
    if (!job) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        job,
        user,
      }, // will be passed to the page component as props
    };
  },
  sessionOptions
);

export default function JobPost(props) {
  useAuthState(false, props.user);
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
        <h1 className="mb-2 mb-10 font-bold tracking-tight text-gray-900 text-7xl dark:text-white">
          {props.job.title}
        </h1>
        <div className="pl-4 mb-8 text-gray-900 border-l-4 dark:text-white">
          <div className="mb-4">
            <p className="mb-3 font-bold">Locations:</p>
            <div>{locations}</div>
          </div>
          <div className="mb-4">
            <p className="mb-3 font-bold">Salary:</p>
            <div>{salary}</div>
          </div>
          <div className="mb-0">
            <p className="mb-3 font-bold">Closing date:</p>
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
                    clipRule="evenodd"
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
              <div className="p-5 font-light text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <p className="mb-2 font-medium">Contract Type:</p>
                <p>{props.job.EmploymentContractType.name}</p>
              </div>
              <div className="p-5 font-light text-gray-900 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-b-xl">
                <p className="mb-2 font-medium">Job Categories:</p>
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
            __html: `<h3 class="mb-3 text-2xl font-bold">Full job description - </h3>${props.job.description}`,
          }}
        />
        <div className="mt-8">
          <Link
            href={`/jobs/${props.job.id}/apply`}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Apply
          </Link>
        </div>
      </article>
    </section>
  );
}
