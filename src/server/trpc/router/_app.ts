import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { zoomRouter } from "./zoom";

export const appRouter = router({
	example: exampleRouter,
	auth: authRouter,
	zoom: zoomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
