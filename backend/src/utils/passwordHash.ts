import bcrypt from 'bcrypt'

const hashPassword = async (plainPassword:string): Promise<string> => {
    try {
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      return hashedPassword;
    } catch (error) {
      
      throw error;
    }
  };

  export default hashPassword
