import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../utils/session'

function handler(req, res) {
  req.session.destroy();
  res.status(200).json({status: 'success'});
}

export default withIronSessionApiRoute(handler, sessionOptions);