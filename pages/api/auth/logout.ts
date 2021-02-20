import { NextApiRequest, NextApiResponse } from "next";
import { unsetAuthCookies } from "next-firebase-auth";
import initAuth from "../../../lib/initAuth"; // the module you created above

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await unsetAuthCookies(req, res);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ success: true });
};

export default handler;
