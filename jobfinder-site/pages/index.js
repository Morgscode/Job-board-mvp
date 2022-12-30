export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default function Home(props) {
  return (<h1>Website</h1>)
}
