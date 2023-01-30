import { router } from "../trpc";
import { authRouter } from "./auth";
import { batchRouter } from "./batch";
import { studentRouter } from "./student";
import { zoomRouter } from "./zoom";

export const appRouter = router({
	auth: authRouter,
	zoom: zoomRouter,
	student: studentRouter,
	batch: batchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
