import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../utils/session';
import meService from '../../services/meService';

async function handler(req, res) {
  const { jwt } = req.session;

  if (!jwt) {
    return res.status(401).json({ data: { message: 'not authroized' } });
  }

  try {
    const details = await meService.index(jwt);
    req.session.user = details;
    await req.session.save();
    return res.status(200).json({ data: { details } });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ data: { message: 'not authroized' } });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
