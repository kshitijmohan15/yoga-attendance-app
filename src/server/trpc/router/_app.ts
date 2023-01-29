import { router } from "../trpc";
import { authRouter } from "./auth";
import { studentRouter } from "./student";
import { zoomRouter } from "./zoom";

export const appRouter = router({
	auth: authRouter,
	zoom: zoomRouter,
	student: studentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
