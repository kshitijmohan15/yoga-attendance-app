import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
	config(_input) {
		return {
			name: "attendance-app",
			region: "ap-south-1",
		};
	},
	stacks(app) {
		app.stack(function Site({ stack }) {
			const site = new NextjsSite(stack, "site", {
				environment: {
					DATABASE_URL:
						"mongodb+srv://kshitijmohan15:serveromAccess@cluster0.d3u3dye.mongodb.net/yoga-attendance-app?retryWrites=true&w=majority",
					NEXTAUTH_URL: "https://d2l9w8civn5ufm.cloudfront.net",
					NEXTAUTH_SECRET:
						"bd2b1aaf7ef4f09be9f52ce2d8d599674d81aa9d6a4421696dc4d93dd0619d682ce56b4d64a9ef097761ced99e0f67265b5f76085e5b0ee7ca4696b2ad6fe2b2",
					GOOGLE_CLIENT_ID:
						"607913476670-u0lpip9gtnkc6ro29dfgok3s22i1121d.apps.googleusercontent.com",
					GOOGLE_CLIENT_SECRET: "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",
				},
			});

			stack.addOutputs({
				SiteUrl: site.url,
			});
		});
	},
} satisfies SSTConfig;
