import { test as omnipizzaTest, expect } from './omnipizza';
import { AuthService } from "../services";

export const API_URL = process.env.API_URL ?? "https://omnipizza-backend.onrender.com";

type ApiFixtures = {
  accessToken: string;
};

type ApiWorkerFixtures = {
  authService: AuthService;
};

export const test = omnipizzaTest.extend<ApiFixtures, ApiWorkerFixtures>({
  authService: [
    async ({}, use) => {
      const auth = await AuthService.create(API_URL);
      await use(auth);
      await auth.dispose();
    },
    { scope: "worker" }
  ],

  accessToken: async ({authService, standardUser}, use) =>{
    const { access_token } = await authService.login(standardUser);
    await use(access_token);
}


})

export {expect};