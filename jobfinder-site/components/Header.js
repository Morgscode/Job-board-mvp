import Navbar from "./Navbar";
// Job search
// Job lister

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function Header() {
  return (<Navbar />);
}
