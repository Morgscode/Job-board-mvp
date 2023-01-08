export default function VerifyEmail() {
    const query = new URLSearchParams(window.location.search || process.window?.location?.search);
    console.log(query.get('token'));
    console.log(query.get('email'));
    return (<h1>Verify email</h1>);
}