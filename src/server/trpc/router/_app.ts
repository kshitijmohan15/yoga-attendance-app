import { router } from "../trpc";
import { authRouter } from "./auth";
import { zoomRouter } from "./zoom";

export const appRouter = router({
	auth: authRouter,
	zoom: zoomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
