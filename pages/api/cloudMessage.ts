import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../lib/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messaging } = firebaseAdmin();
  messaging.send({ condition: "" });
}
