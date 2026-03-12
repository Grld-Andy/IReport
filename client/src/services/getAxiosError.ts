import axios from "axios";

export const getAxiosError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const axiosErr = err;
      const status = axiosErr.response?.status;
      console.log(err)
      console.log(axiosErr.response)
      const message =
        axiosErr.response?.data?.errors
          ?.map((e: { message: string }) => e.message)
          .join(", ") || axiosErr.message;

      return {
        success: false,
        status,
        message,
      };
    } else {
      return {
        success: false,
        status: null,
        message: (err as Error)?.message || "Unknown error",
      };
    }
}