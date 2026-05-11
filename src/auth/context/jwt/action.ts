import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export type SignInParams = {
  identifier: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ identifier, password }: SignInParams): Promise<void> => {
  try {
    const params = { identifier, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    // --- Correct API structure ---
    const tokens = res.data?.data?.tokens;
    const user = res.data?.data?.user;

    if (!tokens?.accessToken) {
      throw new Error("Access token not found in response");
    }
    if (user?.companyId) {
      sessionStorage.setItem("COMPANY_ID", user.companyId);
    }
    // Save token in SESSION (your provider uses sessionStorage)
    sessionStorage.setItem(STORAGE_KEY, tokens.accessToken);

    // This sets axios Authorization header
    setSession(tokens.accessToken);


  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};


/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { tokenData } = res.data;
    console.log("tokenData: ", tokenData);
    if (!tokenData) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, tokenData.token);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
