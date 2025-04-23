import { Request, Response } from 'express';

export const loginController = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Dummy login logic
    res.status(200).json({ message: 'Login successful', email });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
