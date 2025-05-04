import logger from "../../logs/logger";
import proxy from "express-http-proxy";
import dotenv  from "dotenv"

dotenv.config()


const commonProxyOptions = {
    proxyReqOptDecorator: (proxyReqOpts: any, srcReq: any) => {
        proxyReqOpts.headers["Content-Type"] = "application/json";
        return proxyReqOpts;
      },
  
}

export const IdentityServiceProxyOptions = {
    ...commonProxyOptions,
    proxyReqPathResolver: (req: any) => {
        return req.originalUrl.replace(/^\/v1/, "/api");
      },

      userResDecorator: async (proxyRes: any, proxyResData: Buffer) => {
        logger.info(
          `Response received from Identity service: ${proxyRes.statusCode}`
        );
        return proxyResData;
      },

    onError: (err: any, req: any, res: any) => {
        logger.error(`Proxy error: ${err.message}`);
        res.status(500).json({
          message: `Internal server error`,
          error: err.message,
        });
    },
}

if (!process.env.IDENTITY_SERVICE_URL) {
    throw new Error("IDENTITY_SERVICE_URL is not defined in the environment variables.");
}

export const identityServiceProxy = proxy(process.env.IDENTITY_SERVICE_URL, IdentityServiceProxyOptions);