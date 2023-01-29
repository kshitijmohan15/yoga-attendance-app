import { z } from "zod";
import axios from "axios";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const zoomRouter = router({
	refreshToken: publicProcedure
		.input(
			z.object({
				refreshToken: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			try {
				const b = Buffer.from(
					"cfql51F8QvWG0ZwM7o2XoQ" +
						":" +
						"MBx7UEJoh8Vw0OwtbqG2rxePM894LTaw"
				);
				const zoomRes = await fetch(
					`https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${
						input.refreshToken
					}&redirect_uri=${encodeURI("http://localhost:3000")}`,
					{
						method: "POST",
						headers: {
							Authorization: `Basic ${b.toString("base64")}`,
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				);
				const zoomData = await zoomRes.json();
				if (!zoomRes.ok)
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "Could not connect with Zoom",
					});
				if (zoomData.error)
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "Could not connect with Zoom",
					});
				const { access_token, refresh_token } = zoomData;
				return { access_token, refresh_token };
			} catch (e) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Could not connect with Zoom",
				});
			}
		}),
	accessToken: publicProcedure
		.input(
			z.object({
				code: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { code } = input;
			const b = Buffer.from(
				"cfql51F8QvWG0ZwM7o2XoQ" +
					":" +
					"MBx7UEJoh8Vw0OwtbqG2rxePM894LTaw"
			);
			const zoomRes = await fetch(
				`https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000`,
				{
					method: "POST",
					headers: {
						Authorization: `Basic ${b.toString("base64")}`,
					},
				}
			);
			const zoomData = await zoomRes.json();
			const { access_token, refresh_token } = zoomData;
			return { access_token, refresh_token };
		}),

	getMe: publicProcedure
		.input(
			z.object({
				accessToken: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { accessToken } = input;
			try {
				const zoomUserRes = await axios
					.get("https://api.zoom.us/v2/users/me", {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					})
					.then((res) => res.data);
				if (zoomUserRes.message === "Access token is expired.") {
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "Access token is expired.",
					});
				}
				return zoomUserRes;
			} catch (error: any) {
				if (
					error.response.data.message === "Access token is expired."
				) {
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "EXPIRED_ACCESS_TOKEN",
					});
				}
			}
		}),
	getMeetings: publicProcedure
		.input(z.object({ accessToken: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { accessToken } = input;
			try {
				const zoomMeetingResponse = await fetch(
					`https://api.zoom.us/v2/accounts/me/metrics/meetings/85335384845/participants`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				const zoomMeetingData = await zoomMeetingResponse.json();
				console.log("ACCESS TOKEN", accessToken);
				console.log("ZOOM MEETING DATA", zoomMeetingData);
				return zoomMeetingResponse;
			} catch (error: any) {
				if (
					error.response.data.message === "Access token is expired."
				) {
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "EXPIRED_ACCESS_TOKEN",
					});
				}
			}
		}),
});
