// pages/api/help/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import {db} from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, content } = req.body;

    if (!email || !content) {
      return res.status(400).json({ error: 'Email and content are required' });
    }

    try {
      const newEntry = await db.help.create({
        data: {
          email,
          content,
        },
      });
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(500).json({ error: 'Error creating entry' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
